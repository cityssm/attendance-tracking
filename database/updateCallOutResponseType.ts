import * as sqlPool from '@cityssm/mssql-multi-pool'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import * as configFunctions from '../helpers/functions.config.js'
import type * as recordTypes from '../types/recordTypes'

export async function updateCallOutResponseType(
  callOutResponseType: recordTypes.CallOutResponseType,
  sessionUser: recordTypes.User
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('responseType', callOutResponseType.responseType)
    .input('isSuccessful', callOutResponseType.isSuccessful)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .input('responseTypeId', callOutResponseType.responseTypeId)
    .query(`update MonTY.CallOutResponseTypes
      set responseType = @responseType,
      isSuccessful = @isSuccessful,
      recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime
      where responseTypeId = @responseTypeId
      and recordDelete_dateTime is null`)

  clearCacheByTableName('CallOutResponseTypes')

  return result.rowsAffected[0] > 0
}
