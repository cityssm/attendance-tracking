import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'

import { getUserPermissions } from './getUserPermissions.js'

export async function getUser(
  userName: string
): Promise<AttendUser | undefined> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const userResult: IResult<AttendUser> = await pool
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

  return undefined
}
