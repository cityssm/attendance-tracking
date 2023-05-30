import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type { Employee } from '../types/recordTypes'

import { getEmployeeProperties } from './getEmployeeProperties.js'

export async function getEmployee(
  employeeNumber: string
): Promise<Employee | undefined> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const employeeResult: IResult<Employee> = await pool
    .request()
    .input('employeeNumber', employeeNumber).query(`select
      employeeNumber, employeeSurname, employeeGivenName,
      userName,
      workContact1, workContact2, homeContact1, homeContact2, syncContacts,
      jobTitle, department,
      seniorityDateTime,
      isSynced, syncDateTime,
      isActive
      from MonTY.Employees
      where employeeNumber = @employeeNumber
      and recordDelete_dateTime is null`)

  if (employeeResult.recordset.length > 0) {
    const employee = employeeResult.recordset[0]

    employee.employeeProperties = await getEmployeeProperties(
      employee.employeeNumber
    )

    return employee
  }
}
