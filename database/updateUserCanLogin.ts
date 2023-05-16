import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes'

export async function updateUserCanLogin(
  userName: string,
  canLogin: '0' | '1' | 0 | 1 | false | true,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('canLogin', canLogin)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date())
    .input('userName', userName).query(`update MonTY.Users
      set canLogin = @canLogin,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      where userName = @userName
        and recordDelete_dateTime is null`)

  return result.rowsAffected[0] > 0
}