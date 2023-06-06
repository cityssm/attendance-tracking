import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
import { getEmployees } from '../../database/getEmployees.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
import { getAbsenceTypes, getAfterHoursReasons, getCallOutResponseTypes, getEmployeePropertyNames } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
import * as permissionFunctions from '../../helpers/functions.permissions.js';
async function populateAbsenceVariables(requestSession) {
    let absenceRecords = [];
    let absenceTypes = [];
    if (permissionFunctions.hasPermission(requestSession.user, 'attendance.absences.canView')) {
        absenceRecords = await getAbsenceRecords({
            recentOnly: true,
            todayOnly: false
        }, requestSession);
    }
    if (permissionFunctions.hasPermission(requestSession.user, 'attendance.absences.canUpdate')) {
        absenceTypes = await getAbsenceTypes();
    }
    return {
        absenceRecords,
        absenceTypes
    };
}
async function populateReturnToWorkVariables(requestSession) {
    let returnToWorkRecords = [];
    if (permissionFunctions.hasPermission(requestSession.user, 'attendance.returnsToWork.canView')) {
        returnToWorkRecords = await getReturnToWorkRecords({
            recentOnly: true,
            todayOnly: false
        }, requestSession);
    }
    return {
        returnToWorkRecords
    };
}
async function populateCallOutVariables(requestSession) {
    let callOutLists = [];
    let callOutResponseTypes = [];
    const employeeEligibilityFunctionNames = [];
    const employeeSortKeyFunctionNames = [];
    let employeePropertyNames = [];
    if (permissionFunctions.hasPermission(requestSession.user, 'attendance.callOuts.canView')) {
        callOutLists = await getCallOutLists({
            favouriteOnly: false
        }, requestSession);
    }
    if (permissionFunctions.hasPermission(requestSession.user, 'attendance.callOuts.canUpdate')) {
        callOutResponseTypes = await getCallOutResponseTypes();
    }
    if (permissionFunctions.hasPermission(requestSession.user, 'attendance.callOuts.canManage')) {
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
    return {
        callOutLists,
        callOutResponseTypes,
        employeeEligibilityFunctionNames,
        employeeSortKeyFunctionNames,
        employeePropertyNames
    };
}
async function populateAfterHoursVariables(requestSession) {
    let afterHoursRecords = [];
    let afterHoursReasons = [];
    if (permissionFunctions.hasPermission(requestSession.user, 'attendance.afterHours.canView')) {
        afterHoursRecords = await getAfterHoursRecords({
            recentOnly: true,
            todayOnly: false
        }, requestSession);
    }
    if (permissionFunctions.hasPermission(requestSession.user, 'attendance.afterHours.canUpdate')) {
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
    if (configFunctions.getProperty('features.attendance.absences')) {
        const absenceVariables = await populateAbsenceVariables(request.session);
        absenceRecords = absenceVariables.absenceRecords;
        absenceTypes = absenceVariables.absenceTypes;
    }
    let returnToWorkRecords = [];
    if (configFunctions.getProperty('features.attendance.returnsToWork')) {
        const returnToWorkVariables = await populateReturnToWorkVariables(request.session);
        returnToWorkRecords = returnToWorkVariables.returnToWorkRecords;
    }
    let callOutLists = [];
    let callOutResponseTypes = [];
    let employeeEligibilityFunctionNames = [];
    let employeeSortKeyFunctionNames = [];
    let employeePropertyNames = [];
    if (configFunctions.getProperty('features.attendance.callOuts')) {
        const callOutVariables = await populateCallOutVariables(request.session);
        callOutLists = callOutVariables.callOutLists;
        callOutResponseTypes = callOutVariables.callOutResponseTypes;
        employeeEligibilityFunctionNames =
            callOutVariables.employeeEligibilityFunctionNames;
        employeeSortKeyFunctionNames = callOutVariables.employeeSortKeyFunctionNames;
        employeePropertyNames = callOutVariables.employeePropertyNames;
    }
    let afterHoursRecords = [];
    let afterHoursReasons = [];
    if (configFunctions.getProperty('features.attendance.afterHours')) {
        const afterHoursVariables = await populateAfterHoursVariables(request.session);
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
