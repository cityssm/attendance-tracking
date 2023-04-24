import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { User } from '../types/recordTypes'

export async function getUser(userName: string): Promise<User | undefined> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const userResult: IResult<User> = await pool
    .request()
    .input('userName', userName).query(`SELECT top 1
      userName,
      canLogin, canUpdate, isAdmin
      FROM Monty.Users
      where userName = @userName
      and recordDelete_dateTime is null`)

  if (userResult.recordset.length > 0) {
    const user = userResult.recordset[0]
    return user
  }
}
