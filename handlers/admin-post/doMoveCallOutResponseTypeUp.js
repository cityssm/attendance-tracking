import { moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js';
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordUpToTop('CallOutResponseTypes', request.body.responseTypeId)
        : await moveRecordUp('CallOutResponseTypes', request.body.responseTypeId);
    const callOutResponseTypes = await getCallOutResponseTypes();
    response.json({
        success,
        callOutResponseTypes
    });
}
export default handler;
