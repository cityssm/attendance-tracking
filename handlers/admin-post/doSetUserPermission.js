import { setUserPermission } from '../../database/setUserPermission.js';
export async function handler(request, response) {
    const success = await setUserPermission(request.body, request.session);
    response.json({
        success
    });
}
export default handler;
