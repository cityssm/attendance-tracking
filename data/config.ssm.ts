import type { Config } from '../types/configTypes.js'

import {
  eligibility_hasProperty,
  sortKey_alphabetical,
  sortKey_propertyValue,
  sortKey_seniorityDate
} from './functions.js'
import {
  eligibility_operator,
  eligibility_operatorJC6,
  eligibility_operatorJC7,
  eligibility_operatorJC8,
  eligibility_unionized
} from './functions.ssm.js'

export const config: Config = {
  application: {
    applicationName: 'MonTY Call Outs and Attendance'
  },
  reverseProxy: {
    urlPrefix: '/monty'
  },
  session: {},
  aliases: {},
  features: {
    attendance: {
      absences: true,
      afterHours: true,
      callOuts: true,
      returnsToWork: true
    },
    employees: {
      avantiSync: true
    },
    selfService: true
  },
  settings: {
    printPdf: {
      contentDisposition: 'attachment'
    },
    employeeEligibilityFunctions: [
      eligibility_hasProperty,
      eligibility_unionized,
      eligibility_operator,
      eligibility_operatorJC6,
      eligibility_operatorJC7,
      eligibility_operatorJC8
    ],
    employeeSortKeyFunctions: [
      sortKey_seniorityDate,
      sortKey_propertyValue,
      sortKey_alphabetical
    ],
    employeeNumberRegularExpression: /^\d{5,9}$/,
    recentDays: 14,
    updateDays: 4,
    selfService: {}
  }
}

export default config
