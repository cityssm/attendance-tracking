import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getEmployeeProperties(employeeNumber) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const propertyResult = await pool
        .request()
        .input('employeeNumber', employeeNumber).query(`select
      propertyName, propertyValue, isSynced
      from MonTY.EmployeeProperties
      where employeeNumber = @employeeNumber
      and recordDelete_dateTime is null`);
    return propertyResult.recordset;
}
