import { getUsers } from '../../database/getUsers.js';
import { setUserPermission } from '../../database/setUserPermission.js';
export async function handler(request, response) {
    const success = await setUserPermission(request.body);
    const users = await getUsers();
    const responseJson = {
        success,
        users
    };
    response.json(responseJson);
}
export default handler;
