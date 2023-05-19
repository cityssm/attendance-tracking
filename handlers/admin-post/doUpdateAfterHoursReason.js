import { updateAfterHoursReason } from '../../database/updateAfterHoursReason.js';
export async function handler(request, response) {
    const success = await updateAfterHoursReason(request.body, request.session);
    response.json({
        success
    });
}
export default handler;
