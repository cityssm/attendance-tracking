import * as sqlPool from '@cityssm/mssql-multi-pool';
import { clearCacheByTableName } from '../helpers/functions.cache.js';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function deleteEmployee(employeeNumber, sessionUser) {
    const pool = await sqlPool.connect(getConfigProperty('mssql'));
    const result = await pool
        .request()
        .input('employeeNumber', employeeNumber)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date()).query(`update MonTY.Employees
      set recordDelete_userName = @record_userName,
        recordDelete_dateTime = @record_dateTime
      where employeeNumber = @employeeNumber
        and recordDelete_dateTime is null`);
    clearCacheByTableName('EmployeeProperties');
    return result.rowsAffected[0] > 0;
}
