import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getCallOutRecords } from '../../database/getCallOutRecords.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
import * as configFunctions from '../../helpers/functions.config.js';
import * as permissionFunctions from '../../helpers/functions.permissions.js';
export async function handler(request, response) {
    let absenceRecords = [];
    if (configFunctions.getProperty('features.attendance.absences') &&
        permissionFunctions.hasPermission(request.session.user, 'attendance.absences.canView')) {
        absenceRecords = await getAbsenceRecords({
            employeeNumber: request.body.employeeNumber,
            recentOnly: true,
            todayOnly: false
        });
    }
    let returnToWorkRecords = [];
    if (configFunctions.getProperty('features.attendance.returnsToWork') &&
        permissionFunctions.hasPermission(request.session.user, 'attendance.returnsToWork.canView')) {
        returnToWorkRecords = await getReturnToWorkRecords({
            employeeNumber: request.body.employeeNumber,
            recentOnly: true,
            todayOnly: false
        });
    }
    let callOutRecords = [];
    if (configFunctions.getProperty('features.attendance.callOuts') &&
        permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canView')) {
        callOutRecords = await getCallOutRecords({
            employeeNumber: request.body.employeeNumber,
            recentOnly: true
        });
    }
    response.json({
        absenceRecords,
        returnToWorkRecords,
        callOutRecords
    });
}
export default handler;
