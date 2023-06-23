import type { Request } from 'express'

import { getValidatedEmployee } from '../database/getValidatedEmployee.js'

import * as configFunctions from './functions.config.js'

interface EmployeeValidation {
  success: boolean
  errorMessage?: string
  employeeNumber?: string
  employeeSurname?: string
  employeeGivenName?: string
}

interface ValidateEmployeeFieldsRequest extends Partial<Request> {
  body: {
    employeeNumber: string
    employeeHomeContactLastFourDigits: string
  }
}

export async function validateEmployeeFields(
  request: ValidateEmployeeFieldsRequest
): Promise<EmployeeValidation> {
  const employeeNumber = request.body.employeeNumber
  const employeeHomeContactLastFourDigits =
    request.body.employeeHomeContactLastFourDigits

  /*
   * Ensure there is an employee number
   */

  if ((employeeNumber ?? '') === '') {
    return {
      success: false,
      errorMessage: 'No employee number.'
    }
  }

  /*
   * Ensure the last four digits of the phone number are given.
   */

  if (!/^\d{4}$/.test(employeeHomeContactLastFourDigits ?? '')) {
    return {
      success: false,
      errorMessage: 'Invalid home contact number.'
    }
  }

  /*
   * Ensure the employee number matches the regular expression (if available).
   */

  const employeeNumberRegularExpression = configFunctions.getProperty(
    'settings.employeeNumberRegularExpression'
  )

  if (
    employeeNumberRegularExpression !== undefined &&
    !employeeNumberRegularExpression.test(employeeNumber)
  ) {
    return {
      success: false,
      errorMessage: 'Invalid employee number.'
    }
  }

  /*
   * Validate employee
   */

  const employee = await getValidatedEmployee(
    employeeNumber,
    employeeHomeContactLastFourDigits
  )

  if (employee === undefined) {
    return {
      success: false,
      errorMessage: 'Employee not found.'
    }
  }

  return {
    success: true,
    employeeNumber: employee.employeeNumber,
    employeeGivenName: employee.employeeGivenName,
    employeeSurname: employee.employeeSurname
  }
}
