import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { clearCacheByTableName } from '../helpers/functions.cache.js';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function deleteEmployeeProperties(employeeNumber, isSyncUpdate, sessionUser) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const result = await pool
        .request()
        .input('employeeNumber', employeeNumber)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date()).query(`update MonTY.EmployeeProperties
      set recordDelete_userName = @record_userName,
        recordDelete_dateTime = @record_dateTime
      where employeeNumber = @employeeNumber
        and recordDelete_dateTime is not null
        ${isSyncUpdate ? ' and isSynced = 1' : ''}`);
    clearCacheByTableName('EmployeeProperties');
    return result.rowsAffected[0];
}
