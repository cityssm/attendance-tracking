import { moveRecordDown, moveRecordDownToBottom, moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js';
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js';
export async function doMoveCallOutResponseTypeDownHandler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('CallOutResponseTypes', request.body.responseTypeId)
        : await moveRecordDown('CallOutResponseTypes', request.body.responseTypeId);
    const callOutResponseTypes = await getCallOutResponseTypes();
    const responseJson = {
        success,
        callOutResponseTypes
    };
    response.json(responseJson);
}
export async function doMoveCallOutResponseTypeUpHandler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordUpToTop('CallOutResponseTypes', request.body.responseTypeId)
        : await moveRecordUp('CallOutResponseTypes', request.body.responseTypeId);
    const callOutResponseTypes = await getCallOutResponseTypes();
    const responseJson = {
        success,
        callOutResponseTypes
    };
    response.json(responseJson);
}
