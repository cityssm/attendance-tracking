import { getUsers } from '../../database/getUsers.js';
import { updateUserCanLogin } from '../../database/updateUser.js';
export async function handler(request, response) {
    const success = await updateUserCanLogin(request.body.userName, request.body.canLogin, request.session.user);
    const users = await getUsers();
    response.json({
        success,
        users
    });
}
export default handler;
