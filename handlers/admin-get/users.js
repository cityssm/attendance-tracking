import { getUsers } from '../../database/getUsers.js';
export async function handler(request, response) {
    const users = await getUsers();
    response.render('admin.users.ejs', {
        headTitle: 'User Maintenance',
        users
    });
}
export default handler;
