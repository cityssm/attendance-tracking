import type { ConfigEmployeeEligibilityFunction } from '../types/configTypes'

export const employeeEligibilityFunctions: ConfigEmployeeEligibilityFunction[] = [
  {
    functionName: 'Operator - JC 6',
    eligibilityFunction(employee) {
      const jobTitle = (employee.jobTitle ?? '').toLowerCase()
      return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 6')
    }
  },
  {
    functionName: 'Operator - JC 7',
    eligibilityFunction(employee) {
      const jobTitle = (employee.jobTitle ?? '').toLowerCase()
      return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 7')
    }
  },
  {
    functionName: 'Operator - JC 8',
    eligibilityFunction(employee) {
      const jobTitle = (employee.jobTitle ?? '').toLowerCase()
      return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 8')
    }
  }
]
