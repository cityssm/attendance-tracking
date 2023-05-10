import { updateUserCanLogin } from '../../database/updateUserCanLogin.js';
import { getUsers } from '../../database/getUsers.js';
export async function handler(request, response) {
    const success = await updateUserCanLogin(request.body.userName, request.body.canLogin, request.session);
    const users = await getUsers();
    response.json({
        success,
        users
    });
}
export default handler;
