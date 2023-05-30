import { deleteAfterHoursReason } from '../../database/deleteAfterHoursReason.js';
import { getAfterHoursReasons } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteAfterHoursReason(request.body.afterHoursReasonId, request.session);
    const afterHoursReasons = await getAfterHoursReasons();
    response.json({
        success,
        afterHoursReasons
    });
}
export default handler;
