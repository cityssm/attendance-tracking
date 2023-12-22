import { deleteAfterHoursReason } from '../../database/deleteAfterHoursReason.js';
import { getAfterHoursReasons } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteAfterHoursReason(request.body.afterHoursReasonId, request.session.user);
    const afterHoursReasons = await getAfterHoursReasons();
    const responseJson = {
        success,
        afterHoursReasons
    };
    response.json(responseJson);
}
export default handler;
