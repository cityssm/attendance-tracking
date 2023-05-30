import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type { User } from '../types/recordTypes'

import { getUserPermissions } from './getUserPermissions.js'

export async function getUser(userName: string): Promise<User | undefined> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const userResult: IResult<User> = await pool
    .request()
    .input('userName', userName).query(`select
      userName,
      canLogin, isAdmin
      from MonTY.Users
      where userName = @userName
      and recordDelete_dateTime is null`)

  if (userResult.recordset.length > 0) {
    const user = userResult.recordset[0]
    user.permissions = await getUserPermissions(user.userName)
    return user
  }
}
