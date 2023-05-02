import type { ConfigEmployeeSortKeyFunction } from '../types/configTypes'

import * as dateTimeFunctions from '@cityssm/utils-datetime'

export const employeeSortKeyFunctions: ConfigEmployeeSortKeyFunction[] = [
  {
    functionName: 'Seniority Date',
    sortKeyFunction(employee) {
      const seniorityDateString =
        employee.seniorityDateTime === undefined
          ? '9999-99-99'
          : dateTimeFunctions.dateToString(employee.seniorityDateTime)

      return `${seniorityDateString} ${employee.employeeNumber}`
    }
  },
  {
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
  },
  {
    functionName: 'Alphabetical',
    sortKeyFunction(employee) {
      return `${employee.employeeSurname.toLowerCase()} ${employee.employeeGivenName.toLowerCase()} ${
        employee.employeeNumber
      }`
    }
  }
]
