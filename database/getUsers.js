import * as sqlPool from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function getUsers() {
    const pool = await sqlPool.connect(getConfigProperty('mssql'));
    const userResult = await pool.request().query(`select
    u.userName, u.canLogin, u.isAdmin,
    e.employeeNumber, e.employeeSurname, e.employeeGivenName
    from MonTY.Users u
    left join (
      select userName, min(employeeNumber) as employeeNumberMin
      from MonTY.Employees
      where recordDelete_dateTime is null
      group by userName
    ) em on u.userName = em.userName
    left join MonTY.Employees e on em.employeeNumberMin = e.employeeNumber
    where u.recordDelete_dateTime is null`);
    return userResult.recordset;
}
