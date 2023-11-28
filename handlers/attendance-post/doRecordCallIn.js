import { addAbsenceRecord } from '../../database/addAbsenceRecord.js';
import { addReturnToWorkRecord } from '../../database/addReturnToWorkRecord.js';
import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
import { hasPermission } from '../../helpers/functions.permissions.js';
export async function handler(request, response) {
    const callInType = request.body.callInType;
    let success = false;
    let recordId = '';
    let absenceRecords = [];
    let returnToWorkRecords = [];
    if (callInType === 'absence' &&
        hasPermission(request.session.user, 'attendance.absences.canUpdate')) {
        recordId = await addAbsenceRecord(request.body, request.session.user);
        success = true;
        absenceRecords = await getAbsenceRecords({
            recentOnly: true,
            todayOnly: false
        }, request.session.user);
    }
    else if (callInType === 'returnToWork' &&
        hasPermission(request.session.user, 'attendance.returnsToWork.canUpdate')) {
        recordId = await addReturnToWorkRecord(request.body, request.session.user);
        success = true;
        returnToWorkRecords = await getReturnToWorkRecords({
            recentOnly: true,
            todayOnly: false
        }, request.session.user);
    }
    response.json({
        success,
        recordId,
        callInType,
        absenceRecords,
        returnToWorkRecords
    });
}
export default handler;
