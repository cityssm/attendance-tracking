import * as configFunctions from '../../helpers/functions.config.js';
import * as permissionFunctions from '../../helpers/functions.permissions.js';
import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js';
export async function handler(request, response) {
    let absenceRecords = [];
    if (configFunctions.getProperty('features.attendance.absences') &&
        permissionFunctions.hasPermission(request.session.user, 'attendance.absences.canView')) {
        absenceRecords = await getAbsenceRecords({
            recentOnly: true,
            todayOnly: true
        });
    }
    let returnToWorkRecords = [];
    if (configFunctions.getProperty('features.attendance.returnsToWork') &&
        permissionFunctions.hasPermission(request.session.user, 'attendance.returnsToWork.canView')) {
        returnToWorkRecords = await getReturnToWorkRecords({
            recentOnly: true,
            todayOnly: true
        });
    }
    let callOutLists = [];
    let callOutResponseTypes = [];
    if (configFunctions.getProperty('features.attendance.callOuts')) {
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canView')) {
            callOutLists = await getCallOutLists({ favouriteOnly: true }, request.session);
        }
        if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canUpdate')) {
            callOutResponseTypes = await getCallOutResponseTypes();
        }
    }
    response.render('dashboard', {
        headTitle: 'Dashboard',
        absenceRecords,
        returnToWorkRecords,
        callOutLists,
        callOutResponseTypes
    });
}
export default handler;
