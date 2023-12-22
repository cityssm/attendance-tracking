import { addCallOutResponseType } from '../../database/addCallOutResponseType.js';
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const responseTypeId = await addCallOutResponseType(request.body, request.session.user);
    const callOutResponseTypes = await getCallOutResponseTypes();
    const responseJson = {
        success: true,
        responseTypeId,
        callOutResponseTypes
    };
    response.json(responseJson);
}
export default handler;
