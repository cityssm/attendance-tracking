import { addCallOutResponseType } from '../../database/addCallOutResponseType.js';
import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js';
export async function handler(request, response) {
    const responseTypeId = await addCallOutResponseType(request.body, request.session);
    const callOutResponseTypes = await getCallOutResponseTypes();
    response.json({
        success: true,
        responseTypeId,
        callOutResponseTypes
    });
}
export default handler;
