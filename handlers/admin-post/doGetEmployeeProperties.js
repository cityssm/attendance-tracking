import { getEmployeeProperties } from '../../database/getEmployeeProperties.js';
export async function handler(request, response) {
    const employeeProperties = await getEmployeeProperties(request.body.employeeNumber);
    response.json({
        employeeProperties
    });
}
export default handler;
