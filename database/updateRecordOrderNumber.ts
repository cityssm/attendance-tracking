import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

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
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('orderNumber', orderNumber)
    .input('recordId', recordId)
    .query(
      `update MonTY.${recordTable}
        set orderNumber = @orderNumber
        where recordDelete_dateTime is null
        and ${recordIdColumns.get(recordTable)!} = @recordId`
    )

  return result.rowsAffected[0] > 0
}
