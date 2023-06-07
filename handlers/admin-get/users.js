import { getUnusedEmployeeUserNames } from '../../database/getUnusedEmployeeUserNames.js';
import { getUsers } from '../../database/getUsers.js';
import * as configFunctions from '../../helpers/functions.config.js';
import { availablePermissionValues } from '../../helpers/functions.permissions.js';
export async function handler(request, response) {
    const users = await getUsers();
    const tempUsers = configFunctions.getProperty('tempUsers');
    const unusedEmployeeUserNames = await getUnusedEmployeeUserNames();
    response.render('admin.users.ejs', {
        headTitle: 'User Maintenance',
        users,
        tempUsers,
        unusedEmployeeUserNames,
        availablePermissionValues
    });
}
export default handler;
