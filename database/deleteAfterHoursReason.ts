import * as sqlPool from '@cityssm/mssql-multi-pool'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import * as configFunctions from '../helpers/functions.config.js'

export async function deleteAfterHoursReason(
  afterHoursReasonId: number | string,
  sessionUser: MonTYUser
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('afterHoursReasonId', afterHoursReasonId)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.AfterHoursReasons
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where afterHoursReasonId = @afterHoursReasonId
      and recordDelete_dateTime is null`)

  clearCacheByTableName('AfterHoursReasons')

  return result.rowsAffected[0] > 0
}
