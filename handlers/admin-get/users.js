import { getUsers } from '../../database/getUsers.js';
import * as configFunctions from '../../helpers/functions.config.js';
import { availablePermissionValues } from '../../helpers/functions.permissions.js';
export async function handler(request, response) {
    const users = await getUsers();
    const tempUsers = configFunctions.getProperty('tempUsers');
    response.render('admin.users.ejs', {
        headTitle: 'User Maintenance',
        users,
        tempUsers,
        availablePermissionValues
    });
}
export default handler;
