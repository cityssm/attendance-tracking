import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import { getConfigProperty } from '../helpers/functions.config.js'

export async function deleteCallOutResponseType(
  responseTypeId: string,
  sessionUser: AttendUser
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result = await pool
    .request()
    .input('responseTypeId', responseTypeId)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .query(`update MonTY.CallOutResponseTypes
      set recordDelete_userName = @record_userName,
        recordDelete_dateTime = @record_dateTime
      where responseTypeId = @responseTypeId
        and recordDelete_dateTime is null`)

  clearCacheByTableName('CallOutResponseTypes')

  return result.rowsAffected[0] > 0
}
