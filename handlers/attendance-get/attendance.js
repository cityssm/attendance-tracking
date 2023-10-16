import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
import { getEmployees } from '../../database/getEmployees.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
import { getAbsenceTypes, getAfterHoursReasons, getCallOutResponseTypes, getEmployeePropertyNames } from '../../helpers/functions.cache.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
import { hasPermission } from '../../helpers/functions.permissions.js';
async function populateAbsenceVariables(sessionUser) {
    let absenceRecords = [];
    let absenceTypes = [];
    if (hasPermission(sessionUser, 'attendance.absences.canView')) {
        absenceRecords = await getAbsenceRecords({
            recentOnly: true,
            todayOnly: false
        }, sessionUser);
    }
    if (hasPermission(sessionUser, 'attendance.absences.canUpdate')) {
        absenceTypes = await getAbsenceTypes();
    }
    return {
        absenceRecords,
        absenceTypes
    };
}
async function populateReturnToWorkVariables(sessionUser) {
    let returnToWorkRecords = [];
    if (hasPermission(sessionUser, 'attendance.returnsToWork.canView')) {
        returnToWorkRecords = await getReturnToWorkRecords({
            recentOnly: true,
            todayOnly: false
        }, sessionUser);
    }
    return {
        returnToWorkRecords
    };
}
async function populateCallOutVariables(sessionUser) {
    let callOutLists = [];
    let callOutResponseTypes = [];
    const employeeEligibilityFunctionNames = [];
    const employeeSortKeyFunctionNames = [];
    let employeePropertyNames = [];
    if (hasPermission(sessionUser, 'attendance.callOuts.canView')) {
        callOutLists = await getCallOutLists({
            favouriteOnly: false
        }, sessionUser);
    }
    if (hasPermission(sessionUser, 'attendance.callOuts.canUpdate')) {
        callOutResponseTypes = await getCallOutResponseTypes();
    }
    if (hasPermission(sessionUser, 'attendance.callOuts.canManage')) {
        const employeeEligibilityFunctions = getConfigProperty('settings.employeeEligibilityFunctions');
        for (const eligibilityFunction of employeeEligibilityFunctions) {
            employeeEligibilityFunctionNames.push(eligibilityFunction.functionName);
        }
        const employeeSortKeyFunctions = getConfigProperty('settings.employeeSortKeyFunctions');
        for (const sortKeyFunction of employeeSortKeyFunctions) {
            employeeSortKeyFunctionNames.push(sortKeyFunction.functionName);
        }
        employeePropertyNames = await getEmployeePropertyNames();
    }
    return {
        callOutLists,
        callOutResponseTypes,
        employeeEligibilityFunctionNames,
        employeeSortKeyFunctionNames,
        employeePropertyNames
    };
}
async function populateAfterHoursVariables(sessionUser) {
    let afterHoursRecords = [];
    let afterHoursReasons = [];
    if (hasPermission(sessionUser, 'attendance.afterHours.canView')) {
        afterHoursRecords = await getAfterHoursRecords({
            recentOnly: true,
            todayOnly: false
        }, sessionUser);
    }
    if (hasPermission(sessionUser, 'attendance.afterHours.canUpdate')) {
        afterHoursReasons = await getAfterHoursReasons();
    }
    return {
        afterHoursRecords,
        afterHoursReasons
    };
}
export async function handler(request, response) {
    let absenceRecords = [];
    let absenceTypes = [];
    if (getConfigProperty('features.attendance.absences')) {
        const absenceVariables = await populateAbsenceVariables(request.session.user);
        absenceRecords = absenceVariables.absenceRecords;
        absenceTypes = absenceVariables.absenceTypes;
    }
    let returnToWorkRecords = [];
    if (getConfigProperty('features.attendance.returnsToWork')) {
        const returnToWorkVariables = await populateReturnToWorkVariables(request.session.user);
        returnToWorkRecords = returnToWorkVariables.returnToWorkRecords;
    }
    let callOutLists = [];
    let callOutResponseTypes = [];
    let employeeEligibilityFunctionNames = [];
    let employeeSortKeyFunctionNames = [];
    let employeePropertyNames = [];
    if (getConfigProperty('features.attendance.callOuts')) {
        const callOutVariables = await populateCallOutVariables(request.session.user);
        callOutLists = callOutVariables.callOutLists;
        callOutResponseTypes = callOutVariables.callOutResponseTypes;
        employeeEligibilityFunctionNames =
            callOutVariables.employeeEligibilityFunctionNames;
        employeeSortKeyFunctionNames = callOutVariables.employeeSortKeyFunctionNames;
        employeePropertyNames = callOutVariables.employeePropertyNames;
    }
    let afterHoursRecords = [];
    let afterHoursReasons = [];
    if (getConfigProperty('features.attendance.afterHours')) {
        const afterHoursVariables = await populateAfterHoursVariables(request.session.user);
        afterHoursRecords = afterHoursVariables.afterHoursRecords;
        afterHoursReasons = afterHoursVariables.afterHoursReasons;
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
