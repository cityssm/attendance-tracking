import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'

export async function updateUserCanLogin(
  userName: string,
  canLogin: '0' | '1' | 0 | 1 | false | true,
  sessionUser: MonTYUser
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result = await pool
    .request()
    .input('canLogin', canLogin)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .input('userName', userName).query(`update MonTY.Users
      set canLogin = @canLogin,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      where userName = @userName
        and recordDelete_dateTime is null`)

  return result.rowsAffected[0] > 0
}
