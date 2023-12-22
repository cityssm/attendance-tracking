import { deleteReturnToWorkRecord } from '../../database/deleteReturnToWorkRecord.js';
import { getReturnToWorkRecord } from '../../database/getReturnToWorkRecord.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
export async function handler(request, response) {
    const recordId = request.body.recordId;
    const returnToWorkRecord = await getReturnToWorkRecord(recordId, request.session.user);
    let responseJson;
    if (returnToWorkRecord === undefined) {
        responseJson = {
            success: false,
            errorMessage: 'Return to work record not found.'
        };
    }
    else if (returnToWorkRecord.canUpdate) {
        const success = await deleteReturnToWorkRecord(recordId, request.session.user);
        const returnToWorkRecords = await getReturnToWorkRecords({
            recentOnly: true,
            todayOnly: false
        }, request.session.user);
        responseJson = {
            success,
            returnToWorkRecords
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
