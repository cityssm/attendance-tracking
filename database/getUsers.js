import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function getUsers() {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const userResult = await pool.request().query(`select
      u.userName, u.canLogin, u.isAdmin,
      e.employeeNumber, e.employeeSurname, e.employeeGivenName,
      count(p.permissionKey) as permissionCount
    from MonTY.Users u
    left join (
      select userName, min(employeeNumber) as employeeNumberMin
      from MonTY.Employees
      where recordDelete_dateTime is null
      group by userName
    ) em on u.userName = em.userName
    left join MonTY.Employees e on em.employeeNumberMin = e.employeeNumber
    left join MonTY.UserPermissions p on u.userName = p.userName
    where u.recordDelete_dateTime is null
    group by u.userName, u.canLogin, u.isAdmin,
      e.employeeNumber, e.employeeSurname, e.employeeGivenName
    order by u.userName`);
    return userResult.recordset;
}
