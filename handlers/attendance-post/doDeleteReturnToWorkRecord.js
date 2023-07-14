import { deleteReturnToWorkRecord } from '../../database/deleteReturnToWorkRecord.js';
import { getReturnToWorkRecord } from '../../database/getReturnToWorkRecord.js';
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js';
export async function handler(request, response) {
    const recordId = request.body.recordId;
    const returnToWorkRecord = await getReturnToWorkRecord(recordId, request.session.user);
    if (returnToWorkRecord === undefined) {
        response.json({
            success: false,
            errorMessage: 'Return to work record not found.'
        });
        return;
    }
    if (!returnToWorkRecord.canUpdate) {
        response.json({
            success: false,
            errorMessage: 'Access denied.'
        });
        return;
    }
    const success = await deleteReturnToWorkRecord(recordId, request.session.user);
    const returnToWorkRecords = await getReturnToWorkRecords({
        recentOnly: true,
        todayOnly: false
    }, request.session.user);
    response.json({
        success,
        returnToWorkRecords
    });
}
export default handler;
