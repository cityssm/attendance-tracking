import { createEmployee } from '../../database/createEmployee.js';
import { getEmployees } from '../../database/getEmployees.js';
export async function handler(request, response) {
    const success = await createEmployee(request.body, request.session.user);
    if (success) {
        const employees = await getEmployees({
            isActive: 'all'
        }, {
            orderBy: 'name'
        });
        response.json({
            success: true,
            employeeNumber: request.body.employeeNumber,
            employees
        });
    }
    else {
        response.json({
            success: false
        });
    }
}
export default handler;
