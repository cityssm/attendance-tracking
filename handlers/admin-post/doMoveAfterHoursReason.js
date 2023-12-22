import { moveRecordDown, moveRecordDownToBottom, moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js';
import { getAfterHoursReasons } from '../../helpers/functions.cache.js';
export async function doMoveAfterHoursReasonDownHandler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('AfterHoursReasons', request.body.afterHoursReasonId)
        : await moveRecordDown('AfterHoursReasons', request.body.afterHoursReasonId);
    const afterHoursReasons = await getAfterHoursReasons();
    response.json({
        success,
        afterHoursReasons
    });
}
export async function doMoveAfterHoursReasonUpHandler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordUpToTop('AfterHoursReasons', request.body.afterHoursReasonId)
        : await moveRecordUp('AfterHoursReasons', request.body.afterHoursReasonId);
    const afterHoursReasons = await getAfterHoursReasons();
    response.json({
        success,
        afterHoursReasons
    });
}
