import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes'

export async function deleteEmployeeProperties(
  employeeNumber: string,
  requestSession: recordTypes.PartialSession
): Promise<number> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('employeeNumber', employeeNumber)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.EmployeeProperties
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where employeeNumber = @employeeNumber
      and recordDelete_dateTime is not null`)

  return result.rowsAffected[0]
}
