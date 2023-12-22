import { getUserPermissions } from '../../database/getUserPermissions.js';
export async function handler(request, response) {
    const userPermissions = await getUserPermissions(request.body.userName);
    const responseJson = {
        userPermissions
    };
    response.json(responseJson);
}
export default handler;
