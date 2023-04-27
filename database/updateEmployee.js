import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function updateEmployee(employee, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
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
        .input('jobTitle', employee.jobTitle)
        .input('department', employee.department)
        .input('seniorityDateTime', employee.seniorityDateTime)
        .input('isSynced', employee.isSynced ?? false)
        .input('syncDateTime', employee.syncDateTime)
        .input('isActive', employee.isActive ?? true)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date()).query(`update MonTY.Employees
      set employeeSurname = @employeeSurname,
      employeeGivenName = @employeeGivenName,
      userName = @userName,
      workContact1 = @workContact1,
      workContact2 = @workContact2,
      homeContact1 = @homeContact1,
      homeContact2 = @homeContact2,
      jobTitle = @jobTitle,
      department = @department,
      seniorityDateTime = @seniorityDateTime,
      isSynced = @isSynced,
      syncDateTime = @syncDateTime,
      isActive = @isActive,
      recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime
      where employeeNumber = @employeeNumber
      and recordDelete_dateTime is null`);
    return result.rowsAffected[0] > 0;
}
