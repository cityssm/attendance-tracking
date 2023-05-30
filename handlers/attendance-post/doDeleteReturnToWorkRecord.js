import { deleteReturnToWorkRecord } from '../../database/deleteReturnToWorkRecord.js';
import { getReturnToWorkRecord } from '../../database/getReturnToWorkRecord.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
export async function handler(request, response) {
    const recordId = request.body.recordId;
    const returnToWorkRecord = await getReturnToWorkRecord(recordId, request.session);
    if (returnToWorkRecord === undefined) {
        return response.json({
            success: false,
            errorMessage: 'Return to work record not found.'
        });
    }
    if (!returnToWorkRecord.canUpdate) {
        return response.json({
            success: false,
            errorMessage: 'Access denied.'
        });
    }
    const success = await deleteReturnToWorkRecord(recordId, request.session);
    const returnToWorkRecords = await getReturnToWorkRecords({
        recentOnly: true,
        todayOnly: false
    }, request.session);
    response.json({
        success,
        returnToWorkRecords
    });
}
export default handler;
