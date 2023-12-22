import { deleteAbsenceRecord } from '../../database/deleteAbsenceRecord.js';
import { getAbsenceRecord } from '../../database/getAbsenceRecord.js';
import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
export async function handler(request, response) {
    const recordId = request.body.recordId;
    const absenceRecord = await getAbsenceRecord(recordId, request.session.user);
    let responseJson;
    if (absenceRecord === undefined) {
        responseJson = {
            success: false,
            errorMessage: 'Absence record not found.'
        };
    }
    else if (absenceRecord.canUpdate) {
        const success = await deleteAbsenceRecord(recordId, request.session.user);
        const absenceRecords = await getAbsenceRecords({
            recentOnly: true,
            todayOnly: false
        }, {}, request.session.user);
        responseJson = {
            success,
            absenceRecords
        };
    }
    else {
        responseJson = {
            success: false,
            errorMessage: 'Access denied.'
        };
    }
    response.json(responseJson);
}
export default handler;
