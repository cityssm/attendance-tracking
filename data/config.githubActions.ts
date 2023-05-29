import type { Config } from '../types/configTypes.js'

import * as configFunctions from './functions.js'
import { adminUser, manageUser } from './temporaryUsers.js'

// MSSQL Secrets OK
// https://github.com/potatoqualitee/mssqlsuite

// Temp User Secrets OK
// http://www.unit-conversion.info/texttools/random-string-generator/

export const config: Config = {
  activeDirectory: {
    url: 'ldap://',
    baseDN: 'dc=domain,dc=com',
    username: 'username@domain.com',
    password: 'p@ssword'
  },
  mssql: {
    server: 'localhost',
    user: 'sa',
    password: 'dbatools.I0',
    database: 'MonTY',
    options: {
      encrypt: false
    }
  },
  tempUsers: [
    {
      user: adminUser,
      password: '2vxnd9AiL7C3j4BlG4zk7Rlqhz7fOGI23LpF0nmtMIQPtHqPk8sHe8onCx4Hzoee'
    },
    {
      user: manageUser,
      password: '3rJr3oHUt8i74DZe1ypoitKLoxzzWLxzeBZ8eCfCSdYd1frywB18xuguMlwwCWFI'
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
