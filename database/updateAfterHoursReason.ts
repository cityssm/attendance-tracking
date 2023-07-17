import * as sqlPool from '@cityssm/mssql-multi-pool'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import { getConfigProperty } from '../helpers/functions.config.js'
import type { AfterHoursReason } from '../types/recordTypes.js'

export async function updateAfterHoursReason(
  afterHoursReason: AfterHoursReason,
  sessionUser: MonTYUser
): Promise<boolean> {
  const pool = await sqlPool.connect(getConfigProperty('mssql'))

  const result = await pool
    .request()
    .input('afterHoursReason', afterHoursReason.afterHoursReason)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .input('afterHoursReasonId', afterHoursReason.afterHoursReasonId)
    .query(`update MonTY.AfterHoursReasons
      set afterHoursReason = @afterHoursReason,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      where afterHoursReasonId = @afterHoursReasonId
        and recordDelete_dateTime is null`)

  clearCacheByTableName('AfterHoursReasons')

  return result.rowsAffected[0] > 0
}
