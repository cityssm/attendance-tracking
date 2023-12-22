import { updateCallOutResponseType } from '../../database/updateCallOutResponseType.js';
export async function handler(request, response) {
    const success = await updateCallOutResponseType(request.body, request.session.user);
    const responseJson = {
        success
    };
    response.json(responseJson);
}
export default handler;
