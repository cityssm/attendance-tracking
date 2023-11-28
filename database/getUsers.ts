import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'

export async function getUsers(): Promise<AttendUser[]> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const userResult: IResult<AttendUser> = await pool.request().query(`select
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
    where u.recordDelete_dateTime is null
    order by u.userName`)

  return userResult.recordset
}
