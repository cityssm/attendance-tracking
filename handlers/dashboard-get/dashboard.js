import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
import { getEmployees } from '../../database/getEmployees.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
import { hasPermission } from '../../helpers/functions.permissions.js';
function isTemporaryAdmin(user) {
    return (getConfigProperty('application.allowTesting') &&
        (user.userName.startsWith('~~') ?? false) &&
        (user.isAdmin ?? false));
}
async function getAbsenceVariables(user) {
    let absenceRecords = [];
    if (getConfigProperty('features.attendance.absences') &&
        hasPermission(user, 'attendance.absences.canView')) {
        absenceRecords = await getAbsenceRecords({
            recentOnly: true,
            todayOnly: true
        }, user);
    }
    return {
        absenceRecords
    };
}
async function getReturnToWorkVariables(user) {
    let returnToWorkRecords = [];
    if (getConfigProperty('features.attendance.returnsToWork') &&
        hasPermission(user, 'attendance.returnsToWork.canView')) {
        returnToWorkRecords = await getReturnToWorkRecords({
            recentOnly: true,
            todayOnly: true
        }, user);
    }
    return {
        returnToWorkRecords
    };
}
async function getCallOutVariables(user) {
    let callOutLists = [];
    let callOutResponseTypes = [];
    if (getConfigProperty('features.attendance.callOuts') &&
        hasPermission(user, 'attendance.callOuts.canView')) {
        callOutLists = await getCallOutLists({ favouriteOnly: true }, user);
        if (hasPermission(user, 'attendance.callOuts.canUpdate')) {
            callOutResponseTypes = await getCallOutResponseTypes();
        }
    }
    return {
        callOutLists,
        callOutResponseTypes
    };
}
async function getTestingSelfServiceDetails(user) {
    let employeeNumber = '';
    let lastFourDigits = '';
    let lastFourDigitsBad = 1000;
    if (isTemporaryAdmin(user)) {
        const employees = await getEmployees({
            isActive: true
        }, { includeProperties: false });
        const employeeNumberRegex = getConfigProperty('settings.employeeNumberRegularExpression');
        for (const employee of employees) {
            employeeNumber = employee.employeeNumber;
            if (employeeNumberRegex !== undefined &&
                !employeeNumberRegex.test(employeeNumber)) {
                continue;
            }
            const possibleFourDigits1 = (employee.homeContact1 ?? '').slice(-4);
            const possibleFourDigits2 = (employee.homeContact2 ?? '').slice(-4);
            if (/\d{4}/.test(possibleFourDigits1)) {
                lastFourDigits = possibleFourDigits1;
            }
            else if (/\d{4}/.test(possibleFourDigits2)) {
                lastFourDigits = possibleFourDigits2;
            }
            if (lastFourDigits !== '') {
                while (lastFourDigitsBad.toString() === possibleFourDigits1 ||
                    lastFourDigitsBad.toString() === possibleFourDigits2) {
                    lastFourDigitsBad += 1;
                }
            }
        }
    }
    return {
        employeeNumber,
        lastFourDigits,
        lastFourDigitsBad: lastFourDigitsBad.toString()
    };
}
export async function handler(request, response) {
    const authenticatedUser = request.session.user;
    const { absenceRecords } = await getAbsenceVariables(authenticatedUser);
    const { returnToWorkRecords } = await getReturnToWorkVariables(authenticatedUser);
    const { callOutLists, callOutResponseTypes } = await getCallOutVariables(authenticatedUser);
    const { employeeNumber, lastFourDigits, lastFourDigitsBad } = await getTestingSelfServiceDetails(authenticatedUser);
    response.render('dashboard', {
        headTitle: 'Dashboard',
        absenceRecords,
        returnToWorkRecords,
        callOutLists,
        callOutResponseTypes,
        employeeNumber,
        lastFourDigits,
        lastFourDigitsBad: lastFourDigitsBad.toString()
    });
}
export default handler;
