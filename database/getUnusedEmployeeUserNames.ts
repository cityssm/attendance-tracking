import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'

export async function getUnusedEmployeeUserNames(): Promise<string[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const results: IResult<{ userName: string }> = await pool.request()
    .query(`select distinct userName
      from MonTY.Employees
      where userName is not null
      and userName <> ''
      and userName not in (select userName from MonTY.Users where recordDelete_dateTime is null)
      and recordDelete_dateTime is null
      order by userName`)

  const userNames: string[] = []

  for (const result of results.recordset) {
    userNames.push(result.userName)
  }

  return userNames
}
