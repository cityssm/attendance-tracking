import { getEmployeeProperties } from '../../database/getEmployeeProperties.js';
import { getEmployeePropertyValue } from '../../database/getEmployeePropertyValue.js';
import { setEmployeeProperty } from '../../database/setEmployeeProperty.js';
export async function handler(request, response) {
    const employeePropertyValue = await getEmployeePropertyValue(request.body.employeeNumber, request.body.propertyName);
    const success = employeePropertyValue === undefined
        ? await setEmployeeProperty(request.body, false, request.session.user)
        : false;
    const employeeProperties = await getEmployeeProperties(request.body.employeeNumber);
    const responseJson = {
        success,
        employeeProperties
    };
    response.json(responseJson);
}
export default handler;
