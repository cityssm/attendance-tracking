import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'
import type { Employee } from '../types/recordTypes.js'

export async function updateEmployee(
  employee: Employee,
  isSyncUpdate: boolean,
  sessionUser: MonTYUser
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

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
    .input('isSyncUpdate', isSyncUpdate)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.Employees
      set employeeSurname = @employeeSurname,
        employeeGivenName = @employeeGivenName,
        userName = @userName,
        workContact1 = case when @isSyncUpdate = 1 and syncContacts = 0 then workContact1 else @workContact1 end,
        workContact2 = case when @isSyncUpdate = 1 and syncContacts = 0 then workContact2 else @workContact2 end,
        homeContact1 = case when @isSyncUpdate = 1 and syncContacts = 0 then homeContact1 else @homeContact1 end,
        homeContact2 = case when @isSyncUpdate = 1 and syncContacts = 0 then homeContact2 else @homeContact2 end,
        syncContacts = case when @isSyncUpdate = 1 then syncContacts else @syncContacts end,
        jobTitle = @jobTitle,
        department = @department,
        seniorityDateTime = @seniorityDateTime,
        isSynced = @isSynced,
        syncDateTime = case when @isSyncUpdate = 0 then syncDateTime else @syncDateTime end,
        isActive = case when @isSyncUpdate = 1 then isActive else @isActive end,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      where employeeNumber = @employeeNumber
        and recordDelete_dateTime is null`)

  return result.rowsAffected[0] > 0
}
