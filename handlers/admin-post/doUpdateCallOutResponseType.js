import { updateCallOutResponseType } from '../../database/updateCallOutResponseType.js';
export async function handler(request, response) {
    const success = await updateCallOutResponseType(request.body, request.session);
    response.json({
        success
    });
}
export default handler;
