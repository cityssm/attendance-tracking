import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type { User } from '../types/recordTypes'

export async function getUsers(): Promise<User[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const userResult: IResult<User> = await pool.request().query(`select
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
    where u.recordDelete_dateTime is null`)

  return userResult.recordset
}
