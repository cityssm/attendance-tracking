import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import { getConfigProperty } from '../helpers/functions.config.js'

type RecordTable = 'AbsenceTypes' | 'AfterHoursReasons' | 'CallOutResponseTypes'

const recordIdColumns = new Map<RecordTable, string>()
recordIdColumns.set('AbsenceTypes', 'absenceTypeKey')
recordIdColumns.set('AfterHoursReasons', 'afterHoursReasonId')
recordIdColumns.set('CallOutResponseTypes', 'responseTypeId')

export async function updateRecordOrderNumber(
  recordTable: RecordTable,
  recordId: number | string,
  orderNumber: number | string
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result = await pool
    .request()
    .input('orderNumber', orderNumber)
    .input('recordId', recordId)
    .query(
      `update MonTY.${recordTable}
        set orderNumber = @orderNumber
        where recordDelete_dateTime is null
        and ${recordIdColumns.get(recordTable) as string} = @recordId`
    )

  clearCacheByTableName(recordTable)

  return result.rowsAffected[0] > 0
}
