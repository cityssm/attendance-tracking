import * as sqlPool from '@cityssm/mssql-multi-pool'

import * as configFunctions from '../helpers/functions.config.js'
import type * as recordTypes from '../types/recordTypes'

export async function deleteUser(
  userName: string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('userName', userName)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.Users
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where userName = @userName
      and recordDelete_dateTime is null`)

  return result.rowsAffected[0] > 0
}
