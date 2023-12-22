import { getEmployeeProperties } from '../../database/getEmployeeProperties.js';
import { setEmployeeProperty } from '../../database/setEmployeeProperty.js';
export async function handler(request, response) {
    const success = await setEmployeeProperty(request.body, false, request.session.user);
    const employeeProperties = await getEmployeeProperties(request.body.employeeNumber);
    const responseJson = {
        success,
        employeeProperties
    };
    response.json(responseJson);
}
export default handler;
