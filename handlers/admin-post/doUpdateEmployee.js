import { getEmployees } from '../../database/getEmployees.js';
import { updateEmployee } from '../../database/updateEmployee.js';
export async function handler(request, response) {
    const success = await updateEmployee(request.body, false, request.session.user);
    const employees = await getEmployees({
        isActive: 'all'
    }, {
        orderBy: 'name'
    });
    const responseJson = {
        success,
        employees
    };
    response.json(responseJson);
}
export default handler;
