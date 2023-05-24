import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes.js'

export async function deleteCallOutResponseType(
  responseTypeId: string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('responseTypeId', responseTypeId)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.CallOutResponseTypes
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where responseTypeId = @responseTypeId
      and recordDelete_dateTime is null`)

  return result.rowsAffected[0] > 0
}
