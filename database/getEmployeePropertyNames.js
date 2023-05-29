import * as sqlPool from '@cityssm/mssql-multi-pool';
import * as configFunctions from '../helpers/functions.config.js';
export async function getEmployeePropertyNames() {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const propertyResult = await pool.request()
        .query(`select
      distinct propertyName
      from MonTY.EmployeeProperties
      where recordDelete_dateTime is null
      and employeeNumber in (select employeeNumber from MonTY.Employees where recordDelete_dateTime is null)
      order by propertyName`);
    const propertyNames = [];
    for (const record of propertyResult.recordset) {
        propertyNames.push(record.propertyName);
    }
    return propertyNames;
}
