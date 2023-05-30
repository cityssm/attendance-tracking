import * as sqlPool from '@cityssm/mssql-multi-pool'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import * as configFunctions from '../helpers/functions.config.js'
import type * as recordTypes from '../types/recordTypes'

export async function deleteMissingSyncedEmployees(
  syncDateTime: Date,
  requestSession: recordTypes.PartialSession
): Promise<number> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('syncDateTime', syncDateTime)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.Employees
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where isSynced = 1
      and syncDateTime < @syncDateTime
      and recordDelete_dateTime is not null`)

  clearCacheByTableName('EmployeeProperties')

  return result.rowsAffected[0]
}
