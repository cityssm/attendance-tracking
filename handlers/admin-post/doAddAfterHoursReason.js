import { addAfterHoursReason } from '../../database/addAfterHoursReason.js';
import { getAfterHoursReasons } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const afterHoursReasonId = await addAfterHoursReason(request.body, request.session.user);
    const afterHoursReasons = await getAfterHoursReasons();
    const responseJson = {
        success: true,
        afterHoursReasonId,
        afterHoursReasons
    };
    response.json(responseJson);
}
export default handler;
