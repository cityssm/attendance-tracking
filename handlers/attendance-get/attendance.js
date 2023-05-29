import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getAbsenceTypes } from '../../database/getAbsenceTypes.js';
import { getAfterHoursReasons } from '../../database/getAfterHoursReasons.js';
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js';
import { getEmployees } from '../../database/getEmployees.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
import { getEmployeePropertyNames } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
import * as permissionFunctions from '../../helpers/functions.permissions.js';
export async function handler(request, response) {
    let absenceRecords = [];
    let absenceTypes = [];
    if (configFunctions.getProperty('features.attendance.absences')) {
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.absences.canView')) {
            absenceRecords = await getAbsenceRecords({
                recentOnly: true,
                todayOnly: false
            });
        }
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.absences.canUpdate')) {
            absenceTypes = await getAbsenceTypes();
        }
    }
    let returnToWorkRecords = [];
    if (configFunctions.getProperty('features.attendance.returnsToWork') &&
        permissionFunctions.hasPermission(request.session.user, 'attendance.returnsToWork.canView')) {
        returnToWorkRecords = await getReturnToWorkRecords({
            recentOnly: true,
            todayOnly: false
        });
    }
    let callOutLists = [];
    let callOutResponseTypes = [];
    const employeeEligibilityFunctionNames = [];
    const employeeSortKeyFunctionNames = [];
    let employeePropertyNames = [];
    if (configFunctions.getProperty('features.attendance.callOuts')) {
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canView')) {
            callOutLists = await getCallOutLists({
                favouriteOnly: false
            }, request.session);
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
    let afterHoursRecords = [];
    let afterHoursReasons = [];
    if (configFunctions.getProperty('features.attendance.afterHours')) {
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.afterHours.canView')) {
            afterHoursRecords = await getAfterHoursRecords({
                recentOnly: true,
                todayOnly: false
            });
        }
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.afterHours.canUpdate')) {
            afterHoursReasons = await getAfterHoursReasons();
        }
    }
    const employees = await getEmployees({
        isActive: true
    }, {
        orderBy: 'name'
    });
    response.render('attendance', {
        headTitle: 'Employee Attendance',
        absenceRecords,
        absenceTypes,
        returnToWorkRecords,
        callOutLists,
        callOutResponseTypes,
        employeeEligibilityFunctionNames,
        employeeSortKeyFunctionNames,
        afterHoursRecords,
        afterHoursReasons,
        employees,
        employeePropertyNames
    });
}
export default handler;
