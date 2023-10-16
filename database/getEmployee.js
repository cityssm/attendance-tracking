import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
import { getEmployeeProperties } from './getEmployeeProperties.js';
export async function getEmployee(employeeNumber) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const employeeResult = await pool
        .request()
        .input('employeeNumber', employeeNumber).query(`select
      employeeNumber,
      employeeSurname, employeeGivenName,
      coalesce(userName, '') as userName,
      coalesce(workContact1, '') as workContact1,
      coalesce(workContact2, '') as workContact2,
      coalesce(homeContact1, '') as homeContact1,
      coalesce(homeContact2, '') as homeContact2,
      syncContacts,
      coalesce(jobTitle, '') as jobTitle,
      coalesce(department, '') as department,
      seniorityDateTime,
      isSynced, syncDateTime,
      isActive
      from MonTY.Employees
      where employeeNumber = @employeeNumber
      and recordDelete_dateTime is null`);
    if (employeeResult.recordset.length > 0) {
        const employee = employeeResult.recordset[0];
        employee.employeeProperties = await getEmployeeProperties(employee.employeeNumber);
        return employee;
    }
    return undefined;
}
