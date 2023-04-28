import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes'

export async function setEmployeeProperty(
  employeeProperty: recordTypes.EmployeeProperty,
  isSyncUpdate: boolean,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let result = await pool
    .request()
    .input('propertyValue', employeeProperty.propertyValue)
    .input('isSyncUpdate', isSyncUpdate)
    .input('isSynced', employeeProperty.isSynced ?? false)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date())
    .input('employeeNumber', employeeProperty.employeeNumber)
    .input('propertyName', employeeProperty.propertyName)
    .query(`update MonTY.EmployeeProperties
      set propertyValue = case when @isSyncUpdate = 1 and isSynced = 0 then propertyValue else @propertyValue end,
      isSynced = case when @isSyncUpdate = 1 and isSynced = 0 then isSynced else @isSynced end,
      recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime,
      recordDelete_userName = null,
      recordDelete_dateTime = null
      where employeeNumber = @employeeNumber
      and propertyName = @propertyName`)

  if (result.rowsAffected[0] === 0) {
    result = await pool
      .request()
      .input('employeeNumber', employeeProperty.employeeNumber)
      .input('propertyName', employeeProperty.propertyName)
      .input('propertyValue', employeeProperty.propertyValue)
      .input('isSynced', employeeProperty.isSynced ?? false)
      .input('record_userName', requestSession.user?.userName)
      .input('record_dateTime', new Date())
      .query(`insert into MonTY.EmployeeProperties
        (employeeNumber, propertyName, propertyValue, isSynced,
          recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
        values (@employeeNumber, @propertyName, @propertyValue, isSynced,
          @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)
  }

  return result.rowsAffected[0] > 0
}
