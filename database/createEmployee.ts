import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type * as recordTypes from '../types/recordTypes.js'

export async function createEmployee(
  employee: recordTypes.Employee,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const employeeResult: IResult<{ recordDelete_dateTime: Date }> = await pool
    .request()
    .input('employeeNumber', employee.employeeNumber)
    .query(`SELECT employeeNumber, recordDelete_dateTime
        FROM MonTY.Employees
        where employeeNumber = @employeeNumber`)

  let insertSQL = `insert into MonTY.Employees (
      employeeNumber, employeeSurname, employeeGivenName,
      userName,
      workContact1, workContact2, homeContact1, homeContact2, syncContacts,
      jobTitle, department,
      seniorityDateTime,
      isSynced, syncDateTime,
      isActive,
      recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
    values (@employeeNumber, @employeeSurname, @employeeGivenName,
      @userName,
      @workContact1, @workContact2, @homeContact1, @homeContact2, @syncContacts,
      @jobTitle, @department,
      @seniorityDateTime,
      @isSynced, @syncDateTime,
      @isActive,
      @record_userName, @record_dateTime, @record_userName, @record_dateTime)`

  if (employeeResult.recordset.length > 0) {
    const recordDeleteDateTime =
      employeeResult.recordset[0].recordDelete_dateTime ?? undefined

    if (recordDeleteDateTime === undefined) {
      // Active record exists, create not allowed
      return false
    }

    // Deleted record, bring it back

    insertSQL = `update MonTY.Employees
      set employeeSurname = @employeeSurname,
      employeeGivenName = @employeeGivenName,
      userName = @userName,
      workContact1 = @workContact1,
      workContact2 = @workContact2,
      homeContact1 = @homeContact1,
      homeContact2 = @homeContact2,
      syncContacts = @syncContacts,
      jobTitle = @jobTitle,
      department = @department,
      seniorityDateTime = @seniorityDateTime,
      isSynced = @isSynced,
      syncDateTime = @syncDateTime,
      isActive = @isActive,
      recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime,
      recordDelete_userName = null,
      recordDelete_dateTime = null
      where employeeNumber = @employeeNumber
      and recordDelete_dateTime is null`
  }

  const result = await pool
    .request()
    .input('employeeNumber', employee.employeeNumber)
    .input('employeeSurname', employee.employeeSurname)
    .input('employeeGivenName', employee.employeeGivenName)
    .input('userName', employee.userName)
    .input('workContact1', employee.workContact1)
    .input('workContact2', employee.workContact2)
    .input('homeContact1', employee.homeContact1)
    .input('homeContact2', employee.homeContact2)
    .input('syncContacts', employee.syncContacts ?? false)
    .input('jobTitle', employee.jobTitle)
    .input('department', employee.department)
    .input('seniorityDateTime', employee.seniorityDateTime)
    .input('isSynced', employee.isSynced ?? false)
    .input('syncDateTime', employee.syncDateTime)
    .input('isActive', employee.isActive ?? true)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date())
    .query(insertSQL)

  return result.rowsAffected[0] > 0
}
