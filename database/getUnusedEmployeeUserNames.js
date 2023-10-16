import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function getUnusedEmployeeUserNames() {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const results = await pool.request()
        .query(`select distinct userName
      from MonTY.Employees
      where userName is not null
      and userName <> ''
      and userName not in (select userName from MonTY.Users where recordDelete_dateTime is null)
      and recordDelete_dateTime is null
      order by userName`);
    const userNames = [];
    for (const result of results.recordset) {
        userNames.push(result.userName);
    }
    return userNames;
}
