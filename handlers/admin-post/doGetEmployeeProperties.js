import { getEmployeeProperties } from '../../database/getEmployeeProperties.js';
export async function handler(request, response) {
    const employeeProperties = await getEmployeeProperties(request.body.employeeNumber);
    const responseJson = {
        employeeProperties
    };
    response.json(responseJson);
}
export default handler;
