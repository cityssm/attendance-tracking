import { deleteEmployeeProperty } from '../../database/deleteEmployeeProperty.js';
import { getEmployeeProperties } from '../../database/getEmployeeProperties.js';
export async function handler(request, response) {
    const success = await deleteEmployeeProperty(request.body.employeeNumber, request.body.propertyName, request.session);
    const employeeProperties = await getEmployeeProperties(request.body.employeeNumber);
    response.json({
        success,
        employeeProperties
    });
}
export default handler;
