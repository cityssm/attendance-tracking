import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getEmployeePropertyNames() {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const propertyResult = await pool.request()
        .query(`select
      distinct propertyName
      from MonTY.EmployeeProperties
      where recordDelete_dateTime is null
      order by propertyName`);
    const propertyNames = [];
    for (const record of propertyResult.recordset) {
        propertyNames.push(record.propertyName);
    }
    return propertyNames;
}
