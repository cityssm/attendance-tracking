import { updateEmployee } from '../../database/updateEmployee.js';
import { getEmployees } from '../../database/getEmployees.js';
export async function handler(request, response) {
    const success = await updateEmployee(request.body, false, request.session);
    const employees = await getEmployees({
        isActive: 'all'
    }, {
        orderBy: 'name'
    });
    response.json({
        success,
        employees
    });
}
export default handler;
