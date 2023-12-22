import { deleteAfterHoursRecord } from '../../database/deleteAfterHoursRecord.js';
import { getAfterHoursRecord } from '../../database/getAfterHoursRecord.js';
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js';
export async function handler(request, response) {
    const recordId = request.body.recordId;
    const afterHoursRecord = await getAfterHoursRecord(recordId, request.session.user);
    let responseJson;
    if (afterHoursRecord === undefined) {
        responseJson = {
            success: false,
            errorMessage: 'After hours record not found.'
        };
    }
    else if (afterHoursRecord.canUpdate) {
        const success = await deleteAfterHoursRecord(recordId, request.session.user);
        const afterHoursRecords = await getAfterHoursRecords({
            recentOnly: true,
            todayOnly: false
        }, request.session.user);
        responseJson = {
            success,
            afterHoursRecords
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
