import * as configFunctions from '../../helpers/functions.config.js';
import * as permissionFunctions from '../../helpers/functions.permissions.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
import { getEmployeePropertyNames } from '../../database/getEmployeePropertyNames.js';
import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js';
export async function handler(request, response) {
    let callOutLists = [];
    let callOutResponseTypes = [];
    const employeeEligibilityFunctionNames = [];
    const employeeSortKeyFunctionNames = [];
    let employeePropertyNames = [];
    if (configFunctions.getProperty('features.attendance.callOuts')) {
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canView')) {
            callOutLists = await getCallOutLists();
        }
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canUpdate')) {
            callOutResponseTypes = await getCallOutResponseTypes();
        }
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canManage')) {
            const employeeEligibilityFunctions = configFunctions.getProperty('settings.employeeEligibilityFunctions');
            for (const eligibilityFunction of employeeEligibilityFunctions) {
                employeeEligibilityFunctionNames.push(eligibilityFunction.functionName);
            }
            const employeeSortKeyFunctions = configFunctions.getProperty('settings.employeeSortKeyFunctions');
            for (const sortKeyFunction of employeeSortKeyFunctions) {
                employeeSortKeyFunctionNames.push(sortKeyFunction.functionName);
            }
            employeePropertyNames = await getEmployeePropertyNames();
        }
    }
    response.render('attendance', {
        headTitle: 'Employee Attendance',
        callOutLists,
        callOutResponseTypes,
        employeeEligibilityFunctionNames,
        employeeSortKeyFunctionNames,
        employeePropertyNames
    });
}
export default handler;
