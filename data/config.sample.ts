import type { Config } from '../types/configTypes'

import * as configFunctions from './functions.js'

export const config: Config = {
  activeDirectory: {
    url: 'ldap://dc.domain.com',
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
  application: {
    tempAdminPassword: ''
  },
  reverseProxy: {},
  session: {},
  aliases: {},
  features: {},
  settings: {
    employeeEligibilityFunctions: [configFunctions.eligibility_hasProperty],
    employeeSortKeyFunctions: [
      configFunctions.sortKey_seniorityDate,
      configFunctions.sortKey_propertyValue,
      configFunctions.sortKey_alphabetical
    ]
  }
}

export default config
