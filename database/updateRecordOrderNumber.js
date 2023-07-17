import * as sqlPool from '@cityssm/mssql-multi-pool';
import { clearCacheByTableName } from '../helpers/functions.cache.js';
import { getConfigProperty } from '../helpers/functions.config.js';
const recordIdColumns = new Map();
recordIdColumns.set('AbsenceTypes', 'absenceTypeKey');
recordIdColumns.set('AfterHoursReasons', 'afterHoursReasonId');
recordIdColumns.set('CallOutResponseTypes', 'responseTypeId');
export async function updateRecordOrderNumber(recordTable, recordId, orderNumber) {
    const pool = await sqlPool.connect(getConfigProperty('mssql'));
    const result = await pool
        .request()
        .input('orderNumber', orderNumber)
        .input('recordId', recordId)
        .query(`update MonTY.${recordTable}
        set orderNumber = @orderNumber
        where recordDelete_dateTime is null
        and ${recordIdColumns.get(recordTable)} = @recordId`);
    clearCacheByTableName(recordTable);
    return result.rowsAffected[0] > 0;
}
