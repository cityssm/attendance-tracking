import * as sqlPool from '@cityssm/mssql-multi-pool'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import { getConfigProperty } from '../helpers/functions.config.js'
import type { CallOutResponseType } from '../types/recordTypes.js'

export async function updateCallOutResponseType(
  callOutResponseType: CallOutResponseType,
  sessionUser: MonTYUser
): Promise<boolean> {
  const pool = await sqlPool.connect(getConfigProperty('mssql'))

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
