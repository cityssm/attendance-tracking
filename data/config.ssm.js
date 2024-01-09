import { eligibility_hasProperty, sortKey_alphabetical, sortKey_propertyValue, sortKey_seniorityDate } from './functions.js';
import { eligibility_operator, eligibility_operatorJC6, eligibility_operatorJC7, eligibility_operatorJC8, eligibility_unionized } from './functions.ssm.js';
export const config = {
    application: {
        applicationName: 'Call Out Tracking',
        bigLogoURL: '/images-custom/ssm.svg',
        smallLogoURL: '/images-custom/ssm.svg'
    },
    reverseProxy: {
        urlPrefix: '/attendance'
    },
    session: {},
    aliases: {},
    features: {
        attendance: {
            absences: false,
            afterHours: false,
            callOuts: true,
            returnsToWork: false
        },
        employees: {
            avantiSync: true
        },
        selfService: false,
        help: false
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
};
export default config;
