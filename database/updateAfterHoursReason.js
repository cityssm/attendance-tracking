import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { clearCacheByTableName } from '../helpers/functions.cache.js';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function updateAfterHoursReason(afterHoursReason, sessionUser) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const result = await pool
        .request()
        .input('afterHoursReason', afterHoursReason.afterHoursReason)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date())
        .input('afterHoursReasonId', afterHoursReason.afterHoursReasonId)
        .query(`update MonTY.AfterHoursReasons
      set afterHoursReason = @afterHoursReason,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      where afterHoursReasonId = @afterHoursReasonId
        and recordDelete_dateTime is null`);
    clearCacheByTableName('AfterHoursReasons');
    return result.rowsAffected[0] > 0;
}
