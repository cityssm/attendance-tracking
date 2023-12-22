import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getCallOutRecords } from '../../database/getCallOutRecords.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
import { hasPermission } from '../../helpers/functions.permissions.js';
export async function handler(request, response) {
    let absenceRecords = [];
    if (getConfigProperty('features.attendance.absences') &&
        hasPermission(request.session.user, 'attendance.absences.canView')) {
        absenceRecords = await getAbsenceRecords({
            employeeNumber: request.body.employeeNumber,
            recentOnly: true,
            todayOnly: false
        }, {}, request.session.user);
    }
    let returnToWorkRecords = [];
    if (getConfigProperty('features.attendance.returnsToWork') &&
        hasPermission(request.session.user, 'attendance.returnsToWork.canView')) {
        returnToWorkRecords = await getReturnToWorkRecords({
            employeeNumber: request.body.employeeNumber,
            recentOnly: true,
            todayOnly: false
        }, request.session.user);
    }
    let callOutRecords = [];
    if (getConfigProperty('features.attendance.callOuts') &&
        hasPermission(request.session.user, 'attendance.callOuts.canView')) {
        callOutRecords = await getCallOutRecords({
            employeeNumber: request.body.employeeNumber,
            recentOnly: true
        });
    }
    const responseJson = {
        absenceRecords,
        returnToWorkRecords,
        callOutRecords
    };
    response.json(responseJson);
}
export default handler;
