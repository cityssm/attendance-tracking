import { deleteCallOutResponseType } from '../../database/deleteCallOutResponseType.js';
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteCallOutResponseType(request.body.responseTypeId, request.session);
    const callOutResponseTypes = await getCallOutResponseTypes();
    response.json({
        success,
        callOutResponseTypes
    });
}
export default handler;
