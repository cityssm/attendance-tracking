import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { User } from '../types/recordTypes'

export async function getUsers(): Promise<User[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const userResult: IResult<User> = await pool.request().query(`select
    userName, canLogin, isAdmin
    from MonTY.Users
    where recordDelete_dateTime is null`)

  return userResult.recordset
}
