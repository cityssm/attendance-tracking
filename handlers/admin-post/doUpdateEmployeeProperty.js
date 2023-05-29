import { getEmployeeProperties } from '../../database/getEmployeeProperties.js';
import { setEmployeeProperty } from '../../database/setEmployeeProperty.js';
export async function handler(request, response) {
    const success = await setEmployeeProperty(request.body, false, request.session);
    const employeeProperties = await getEmployeeProperties(request.body.employeeNumber);
    response.json({
        success,
        employeeProperties
    });
}
export default handler;
