import { getUserPermissions } from '../../database/getUserPermissions.js';
export async function handler(request, response) {
    const userPermissions = await getUserPermissions(request.body.userName);
    response.json({
        userPermissions
    });
}
export default handler;
