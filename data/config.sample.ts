import type { Config } from '../types/configTypes.js'

import {
  eligibility_hasProperty,
  sortKey_alphabetical,
  sortKey_propertyValue,
  sortKey_seniorityDate
} from './functions.js'

export const config: Config = {
  activeDirectory: {
    url: 'ldap://',
    baseDN: 'dc=domain,dc=com',
    username: 'username@domain.com',
    password: 'p@ssword'
  },
  mssql: {
    server: 'localhost',
    database: 'MonTY',
    user: 'username',
    password: 'p@ssword'
  },
  application: {},
  reverseProxy: {},
  tempUsers: [],
  session: {},
  aliases: {},
  features: {},
  settings: {
    employeeEligibilityFunctions: [eligibility_hasProperty],
    employeeSortKeyFunctions: [
      sortKey_seniorityDate,
      sortKey_propertyValue,
      sortKey_alphabetical
    ]
  }
}

export default config
