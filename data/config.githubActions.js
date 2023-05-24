import * as configFunctions from './functions.js';
export const config = {
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
    application: {
        tempAdminPassword: 'admin'
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
};
export default config;
