import { deleteEmployeeProperty } from '../../database/deleteEmployeeProperty.js';
import { getEmployeeProperties } from '../../database/getEmployeeProperties.js';
export async function handler(request, response) {
    const success = await deleteEmployeeProperty(request.body.employeeNumber, request.body.propertyName, request.session.user);
    const employeeProperties = await getEmployeeProperties(request.body.employeeNumber);
    const responseJson = {
        success,
        employeeProperties
    };
    response.json(responseJson);
}
export default handler;
