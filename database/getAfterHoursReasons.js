import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export async function getAfterHoursReasons() {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const reasonsResult = await pool.request()
        .query(`select
      afterHoursReasonId, afterHoursReason, orderNumber
      from MonTY.AfterHoursReasons
      where recordDelete_dateTime is null
      order by orderNumber, afterHoursReason`);
    const reasons = reasonsResult.recordset;
    let expectedOrderNumber = -1;
    for (const reason of reasons) {
        expectedOrderNumber += 1;
        if (reason.orderNumber !== expectedOrderNumber) {
            await updateRecordOrderNumber('AfterHoursReasons', reason.afterHoursReasonId, expectedOrderNumber);
        }
    }
    return reasons;
}
