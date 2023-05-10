import { addUser } from '../../database/addUser.js';
import { getUsers } from '../../database/getUsers.js';
export async function handler(request, response) {
    const success = await addUser(request.body.userName, request.session);
    const users = await getUsers();
    response.json({
        success,
        users
    });
}
export default handler;
