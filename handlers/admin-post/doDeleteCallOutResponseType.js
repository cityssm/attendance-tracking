import { deleteCallOutResponseType } from '../../database/deleteCallOutResponseType.js';
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteCallOutResponseType(request.body.responseTypeId, request.session.user);
    const callOutResponseTypes = await getCallOutResponseTypes();
    const responseJson = {
        success,
        callOutResponseTypes
    };
    response.json(responseJson);
}
export default handler;
