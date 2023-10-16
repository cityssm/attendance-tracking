import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function getEmployeeProperties(employeeNumber) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const propertyResult = await pool
        .request()
        .input('employeeNumber', employeeNumber).query(`select
      propertyName, propertyValue, isSynced
      from MonTY.EmployeeProperties
      where employeeNumber = @employeeNumber
      and recordDelete_dateTime is null`);
    return propertyResult.recordset;
}
