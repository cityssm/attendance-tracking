import { createEmployee } from '../../database/createEmployee.js';
import { getEmployees } from '../../database/getEmployees.js';
export async function handler(request, response) {
    let responseJson;
    const success = await createEmployee(request.body, request.session.user);
    if (success) {
        const employees = await getEmployees({
            isActive: 'all'
        }, {
            orderBy: 'name'
        });
        responseJson = {
            success: true,
            employeeNumber: request.body.employeeNumber,
            employees
        };
    }
    else {
        responseJson = {
            success: false
        };
    }
    response.json(responseJson);
}
export default handler;
