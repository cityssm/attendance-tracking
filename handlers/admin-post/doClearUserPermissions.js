import { clearUserPermissions } from '../../database/clearUserPermissions.js';
import { getUsers } from '../../database/getUsers.js';
export async function handler(request, response) {
    const success = await clearUserPermissions(request.body.userName);
    const users = await getUsers();
    const responseJson = {
        success,
        users
    };
    response.json(responseJson);
}
export default handler;
