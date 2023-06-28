import * as sqlPool from '@cityssm/mssql-multi-pool'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import * as configFunctions from '../helpers/functions.config.js'
import type * as recordTypes from '../types/recordTypes'

export async function deleteEmployeeProperty(
  employeeNumber: string,
  propertyName: string,
  sessionUser: recordTypes.User
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('employeeNumber', employeeNumber)
    .input('propertyName', propertyName)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.EmployeeProperties
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where employeeNumber = @employeeNumber
      and propertyName = @propertyName
      and recordDelete_dateTime is null`)

  clearCacheByTableName('EmployeeProperties')

  return result.rowsAffected[0] > 0
}
