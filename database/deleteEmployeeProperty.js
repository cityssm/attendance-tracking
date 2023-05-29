import * as sqlPool from '@cityssm/mssql-multi-pool';
import * as configFunctions from '../helpers/functions.config.js';
import { clearCacheByTableName } from '../helpers/functions.cache.js';
export async function deleteEmployeeProperty(employeeNumber, propertyName, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('employeeNumber', employeeNumber)
        .input('propertyName', propertyName)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date()).query(`update MonTY.EmployeeProperties
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where employeeNumber = @employeeNumber
      and propertyName = @propertyName
      and recordDelete_dateTime is null`);
    clearCacheByTableName('EmployeeProperties');
    return result.rowsAffected[0] > 0;
}
