import '../helpers/polyfills.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type { Employee } from '../types/recordTypes'

import { getEmployeeProperties } from './getEmployeeProperties.js'

interface GetEmployeesFilters {
  eligibilityFunction?: {
    functionName: string
    employeePropertyName: string
  }
  isActive?: boolean | 'all'
}

interface GetEmployeesOptions {
  includeProperties?: boolean
  orderBy?: 'name' | 'employeeNumber'
}

export async function getEmployees(
  filters: GetEmployeesFilters,
  options: GetEmployeesOptions
): Promise<Employee[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let request = pool.request()

  let sql = `select
    employeeNumber, employeeSurname, employeeGivenName,
    userName,
    workContact1, workContact2, homeContact1, homeContact2, syncContacts,
    jobTitle, department,
    seniorityDateTime,
    isSynced, syncDateTime,
    isActive
    from MonTY.Employees
    where recordDelete_dateTime is null`

  if (
    Object.hasOwn(filters, 'isActive') &&
    typeof filters.isActive === 'boolean'
  ) {
    request = request.input('isActive', filters.isActive)
    sql += ' and isActive = @isActive'
  }

  sql +=
    Object.hasOwn(options, 'orderBy') && options.orderBy === 'name'
      ? ' order by employeeSurname, employeeGivenName, employeeNumber'
      : ' order by employeeNumber'

  const result: IResult<Employee> = await request.query(sql)

  let employees = result.recordset as Employee[]

  if (
    ((filters.eligibilityFunction ?? '') !== '' || options.includeProperties) ??
    false
  ) {
    for (const employee of employees) {
      employee.employeeProperties = await getEmployeeProperties(
        employee.employeeNumber
      )
    }

    if ((filters.eligibilityFunction?.functionName ?? '') !== '') {
      const eligibilityFunction = configFunctions
        .getProperty('settings.employeeEligibilityFunctions')
        .find((possibleFunction) => {
          return (
            possibleFunction.functionName ===
            filters.eligibilityFunction?.functionName
          )
        })

      if (eligibilityFunction !== undefined) {
        employees = employees.filter((possibleEmployee) =>
          eligibilityFunction?.eligibilityFunction(
            possibleEmployee,
            filters.eligibilityFunction?.employeePropertyName
          )
        )
      }
    }
  }

  return employees
}
