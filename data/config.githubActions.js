import { eligibility_hasProperty, sortKey_alphabetical, sortKey_propertyValue, sortKey_seniorityDate } from './functions.js';
import { adminUser, manageUser } from './temporaryUsers.js';
export const config = {
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
        database: 'Attend',
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
    application: {
        allowTesting: true
    },
    reverseProxy: {},
    session: {},
    aliases: {},
    features: {
        selfService: true
    },
    settings: {
        employeeEligibilityFunctions: [eligibility_hasProperty],
        employeeSortKeyFunctions: [
            sortKey_seniorityDate,
            sortKey_propertyValue,
            sortKey_alphabetical
        ]
    }
};
export default config;
