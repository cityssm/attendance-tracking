import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js';
import { moveRecordDown, moveRecordDownToBottom } from '../../database/moveRecord.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('CallOutResponseTypes', request.body.responseTypeId)
        : await moveRecordDown('CallOutResponseTypes', request.body.responseTypeId);
    const callOutResponseTypes = await getCallOutResponseTypes();
    response.json({
        success,
        callOutResponseTypes
    });
}
export default handler;
