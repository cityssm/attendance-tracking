import { setUserPermission } from '../../database/setUserPermission.js';
export async function handler(request, response) {
    const success = await setUserPermission(request.body);
    const responseJson = {
        success
    };
    response.json(responseJson);
}
export default handler;
