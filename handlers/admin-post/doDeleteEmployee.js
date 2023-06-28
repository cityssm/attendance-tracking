import { deleteEmployee } from '../../database/deleteEmployee.js';
import { getEmployees } from '../../database/getEmployees.js';
export async function handler(request, response) {
    const success = await deleteEmployee(request.body.employeeNumber, request.session.user);
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
