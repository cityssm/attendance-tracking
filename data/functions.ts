/* eslint-disable @typescript-eslint/naming-convention */

import { dateToString } from '@cityssm/utils-datetime'

import type {
  ConfigEmployeeSortKeyFunction,
  ConfigEmployeeEligibilityFunction
} from '../types/configTypes.js'

/*
 * Eligibility
 */

export const eligibility_hasProperty: ConfigEmployeeEligibilityFunction = {
  functionName: 'Has Property',
  eligibilityFunction(employee, employeePropertyName) {
    const propertyNameLower = employeePropertyName?.toLowerCase()

    return (
      employee.employeeProperties?.some((possibleProperty) => {
        return possibleProperty.propertyName.toLowerCase() === propertyNameLower
      }) ?? false
    )
  }
}

/*
 * Sort Key
 */

export const sortKey_alphabetical: ConfigEmployeeSortKeyFunction = {
  functionName: 'Alphabetical',
  sortKeyFunction(employee) {
    return `${employee.employeeSurname.toLowerCase()} ${employee.employeeGivenName.toLowerCase()} ${
      employee.employeeNumber
    }`
  }
}

export const sortKey_propertyValue: ConfigEmployeeSortKeyFunction = {
  functionName: 'Property Value',
  sortKeyFunction(employee, employeePropertyName) {
    const propertyNameLower = employeePropertyName?.toLowerCase()

    const property = employee.employeeProperties?.find((possibleProperty) => {
      return possibleProperty.propertyName.toLowerCase() === propertyNameLower
    })

    if (property === undefined) {
      return ''
    }
    return property.propertyValue
  }
}

export const sortKey_seniorityDate: ConfigEmployeeSortKeyFunction = {
  functionName: 'Seniority Date',
  sortKeyFunction(employee) {
    return employee.seniorityDateTime === undefined
      ? '9999-99-99'
      : dateToString(employee.seniorityDateTime as Date)
  }
}
