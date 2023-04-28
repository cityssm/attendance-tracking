import * as dateTimeFunctions from '@cityssm/utils-datetime';
export const employeeSortKeyFunctions = [
    {
        functionName: 'Seniority Date',
        sortKeyFunction(employee) {
            const seniorityDateString = employee.seniorityDateTime === undefined
                ? '9999-99-99'
                : dateTimeFunctions.dateToString(employee.seniorityDateTime);
            return `${seniorityDateString} ${employee.employeeNumber}`;
        }
    },
    {
        functionName: 'Alphabetical',
        sortKeyFunction(employee) {
            return `${employee.employeeSurname.toLowerCase()} ${employee.employeeGivenName.toLowerCase()} ${employee.employeeNumber}`;
        }
    }
];
