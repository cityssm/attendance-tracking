import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import { getConfigProperty } from '../helpers/functions.config.js'

import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

type RecordTable = 'AbsenceTypes' | 'AfterHoursReasons' | 'CallOutResponseTypes'

const recordIdColumns = new Map<RecordTable, string>()
recordIdColumns.set('AbsenceTypes', 'absenceTypeKey')
recordIdColumns.set('AfterHoursReasons', 'afterHoursReasonId')
recordIdColumns.set('CallOutResponseTypes', 'responseTypeId')

async function getCurrentOrderNumber(
  recordTable: RecordTable,
  recordId: number | string
): Promise<number> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result: IResult<{ orderNumber: number }> = await pool
    .request()
    .input('recordId', recordId)
    .query(
      `select orderNumber
        from MonTY.${recordTable}
        where ${recordIdColumns.get(recordTable) ?? ''} = @recordId`
    )

  return result.recordset[0].orderNumber
}

export async function moveRecordDown(
  recordTable: RecordTable,
  recordId: number | string
): Promise<boolean> {
  const currentOrderNumber = await getCurrentOrderNumber(recordTable, recordId)

  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  await pool
    .request()
    .input('currentOrderNumber', currentOrderNumber)
    .query(
      `update MonTY.${recordTable}
        set orderNumber = orderNumber - 1
        where recordDelete_dateTime is null
        and orderNumber = @currentOrderNumber + 1`
    )

  const success = await updateRecordOrderNumber(
    recordTable,
    recordId,
    currentOrderNumber + 1
  )

  clearCacheByTableName(recordTable)

  return success
}

export async function moveRecordDownToBottom(
  recordTable: RecordTable,
  recordId: number | string
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const currentOrderNumber = await getCurrentOrderNumber(recordTable, recordId)

  const maxOrderNumberResult: IResult<{ maxOrderNumber: number }> = await pool
    .request()
    .query(
      `select max(orderNumber) as maxOrderNumber
        from MonTY.${recordTable}
        where recordDelete_dateTime is null`
    )

  const maxOrderNumber = maxOrderNumberResult.recordset[0].maxOrderNumber

  if (currentOrderNumber !== maxOrderNumber) {
    await updateRecordOrderNumber(recordTable, recordId, maxOrderNumber + 1)

    await pool
      .request()
      .input('currentOrderNumber', currentOrderNumber)
      .query(
        `update MonTY.${recordTable}
          set orderNumber = orderNumber - 1
          where recordDelete_dateTime is null
          and orderNumber > @currentOrderNumber`
      )

    clearCacheByTableName(recordTable)
  }

  return true
}

export async function moveRecordUp(
  recordTable: RecordTable,
  recordId: number | string
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const currentOrderNumber = await getCurrentOrderNumber(recordTable, recordId)

  if (currentOrderNumber <= 0) {
    return true
  }

  await pool
    .request()
    .input('currentOrderNumber', currentOrderNumber)
    .query(
      `update MonTY.${recordTable}
        set orderNumber = orderNumber + 1
        where recordDelete_dateTime is null
        and orderNumber = @currentOrderNumber - 1`
    )

  const success = await updateRecordOrderNumber(
    recordTable,
    recordId,
    currentOrderNumber - 1
  )

  clearCacheByTableName(recordTable)

  return success
}

export async function moveRecordUpToTop(
  recordTable: RecordTable,
  recordId: number | string
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const currentOrderNumber = await getCurrentOrderNumber(recordTable, recordId)

  if (currentOrderNumber > 0) {
    await updateRecordOrderNumber(recordTable, recordId, -1)

    await pool
      .request()
      .input('currentOrderNumber', currentOrderNumber)
      .query(
        `update MonTY.${recordTable}
          set orderNumber = orderNumber + 1
          where recordDelete_dateTime is null
          and orderNumber < @currentOrderNumber`
      )

    clearCacheByTableName(recordTable)
  }

  return true
}
