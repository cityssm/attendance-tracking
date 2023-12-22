import { getUsers } from '../../database/getUsers.js';
import { updateUserCanLogin, updateUserIsAdmin } from '../../database/updateUser.js';
export async function doUpdateUserCanLoginHandler(request, response) {
    const success = await updateUserCanLogin(request.body.userName, request.body.canLogin, request.session.user);
    const users = await getUsers();
    const responseJson = {
        success,
        users
    };
    response.json(responseJson);
}
export async function doUpdateUserIsAdminHandler(request, response) {
    const success = await updateUserIsAdmin(request.body.userName, request.body.isAdmin, request.session.user);
    const users = await getUsers();
    const responseJson = {
        success,
        users
    };
    response.json(responseJson);
}
