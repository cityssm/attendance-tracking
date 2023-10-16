// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */

import type { ConfigEmployeeEligibilityFunction } from '../types/configTypes.js'

/*
 * Eligibility
 */

export const eligibility_unionized: ConfigEmployeeEligibilityFunction = {
  functionName: 'Unionized Employees',
  eligibilityFunction(employee) {
    const payGroup = employee.employeeProperties?.find((possibleProperty) => {
      return possibleProperty.propertyName.toLowerCase() === 'paygroup'
    })

    return (
      payGroup !== undefined && ['310', '311'].includes(payGroup.propertyValue)
    )
  }
}

export const eligibility_operator: ConfigEmployeeEligibilityFunction = {
  functionName: 'Operator - All Job Classes',
  eligibilityFunction(employee) {
    const jobTitle = (employee.jobTitle ?? '').toLowerCase()
    return jobTitle.startsWith('operator ')
  }
}

export const eligibility_operatorJC6: ConfigEmployeeEligibilityFunction = {
  functionName: 'Operator - JC 6',
  eligibilityFunction(employee) {
    const jobTitle = (employee.jobTitle ?? '').toLowerCase()
    return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 6')
  }
}

export const eligibility_operatorJC7: ConfigEmployeeEligibilityFunction = {
  functionName: 'Operator - JC 7',
  eligibilityFunction(employee) {
    const jobTitle = (employee.jobTitle ?? '').toLowerCase()
    return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 7')
  }
}

export const eligibility_operatorJC8: ConfigEmployeeEligibilityFunction = {
  functionName: 'Operator - JC 8',
  eligibilityFunction(employee) {
    const jobTitle = (employee.jobTitle ?? '').toLowerCase()
    return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 8')
  }
}
