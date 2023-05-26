import type { Config } from '../types/configTypes.js'

import crypto from 'node:crypto'
import * as configFunctions from './functions.js'

import { adminUser, manageUser } from './temporaryUsers.js'

// MSSQL Secrets OK
// https://github.com/potatoqualitee/mssqlsuite

export const config: Config = {
  activeDirectory: {
    url: 'ldap://dc.domain.com',
    baseDN: 'dc=domain,dc=com',
    username: 'username@domain.com',
    password: 'p@ssword'
  },
  mssql: {
    server: 'localhost',
    user: 'sa',
    password: 'dbatools.IO',
    database: 'MonTY',
    options: {
      encrypt: false
    }
  },
  tempUsers: [
    {
      user: adminUser,
      password: crypto.randomUUID()
    },
    {
      user: manageUser,
      password: crypto.randomUUID()
    }
  ],
  application: {},
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
