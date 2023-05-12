import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
import { addAbsenceRecord } from '../../database/addAbsenceRecord.js';
import { addReturnToWorkRecord } from '../../database/addReturnToWorkRecord.js';
import * as permissionFunctions from '../../helpers/functions.permissions.js';
export async function handler(request, response) {
    const callInType = request.body.callInType;
    let success = false;
    let recordId = '';
    let absenceRecords = [];
    let returnToWorkRecords = [];
    switch (callInType) {
        case 'absence': {
            if (permissionFunctions.hasPermission(request.session.user, 'attendance.absences.canUpdate')) {
                recordId = await addAbsenceRecord(request.body, request.session);
                success = true;
                absenceRecords = await getAbsenceRecords({
                    recentOnly: true
                });
            }
            break;
        }
        case 'returnToWork': {
            if (permissionFunctions.hasPermission(request.session.user, 'attendance.returnsToWork.canUpdate')) {
                recordId = await addReturnToWorkRecord(request.body, request.session);
                success = true;
                returnToWorkRecords = await getReturnToWorkRecords({
                    recentOnly: true
                });
            }
            break;
        }
    }
    response.json({
        success,
        recordId,
        absenceRecords,
        returnToWorkRecords
    });
}
export default handler;
