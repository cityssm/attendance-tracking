import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getEmployeePropertyValue(employeeNumber, propertyName) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const propertyResult = await pool
        .request()
        .input('employeeNumber', employeeNumber)
        .input('propertyName', propertyName).query(`select
      propertyValue
      from MonTY.EmployeeProperties
      where employeeNumber = @employeeNumber
      and propertyName = @propertyName
      and recordDelete_dateTime is null`);
    if (propertyResult.recordset.length === 0) {
        return undefined;
    }
    return propertyResult.recordset[0].propertyValue ?? '';
}