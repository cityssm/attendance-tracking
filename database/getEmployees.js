import '../helpers/polyfills.js';
import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import { getEmployeeProperties } from './getEmployeeProperties.js';
export async function getEmployees(filters, options) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    let request = pool.request();
    let sql = `select
    employeeNumber, employeeSurname, employeeGivenName,
    userName,
    workContact1, workContact2, homeContact1, homeContact2, syncContacts,
    jobTitle, department,
    seniorityDateTime,
    isSynced, syncDateTime,
    isActive
    from MonTY.Employees
    where recordDelete_dateTime is null`;
    if (Object.hasOwn(filters, 'isActive')) {
        request = request.input('isActive', filters.isActive);
        sql += ' and isActive = @isActive';
    }
    sql +=
        Object.hasOwn(options, 'orderBy') && options.orderBy === 'name'
            ? ' order by employeeSurname, employeeGivenName, employeeNumber'
            : ' order by employeeNumber';
    const result = await request.query(sql);
    let employees = result.recordset;
    if (Object.hasOwn(filters, 'eligibilityFunction') ||
        Object.hasOwn(options, 'includeProperties')) {
        for (const employee of employees) {
            employee.employeeProperties = await getEmployeeProperties(employee.employeeNumber);
        }
        if ((filters.eligibilityFunction?.functionName ?? '') !== '') {
            const eligibilityFunction = configFunctions
                .getProperty('settings.employeeEligibilityFunctions')
                .find((possibleFunction) => {
                return (possibleFunction.functionName ===
                    filters.eligibilityFunction?.functionName);
            });
            if (eligibilityFunction !== undefined) {
                employees = employees.filter((possibleEmployee) => eligibilityFunction?.eligibilityFunction(possibleEmployee, filters.eligibilityFunction?.employeePropertyName));
            }
        }
    }
    return employees;
}
