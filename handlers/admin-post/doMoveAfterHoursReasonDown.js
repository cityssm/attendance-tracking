import { getAfterHoursReasons } from '../../database/getAfterHoursReasons.js';
import { moveRecordDown, moveRecordDownToBottom } from '../../database/moveRecord.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('AfterHoursReasons', request.body.afterHoursReasonId)
        : await moveRecordDown('AfterHoursReasons', request.body.afterHoursReasonId);
    const afterHoursReasons = await getAfterHoursReasons();
    response.json({
        success,
        afterHoursReasons
    });
}
export default handler;
