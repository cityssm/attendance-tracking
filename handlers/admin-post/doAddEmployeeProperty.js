import { getEmployeePropertyValue } from '../../database/getEmployeePropertyValue.js';
import { setEmployeeProperty } from '../../database/setEmployeeProperty.js';
import { getEmployeeProperties } from '../../database/getEmployeeProperties.js';
export async function handler(request, response) {
    const employeePropertyValue = await getEmployeePropertyValue(request.body.employeeNumber, request.body.propertyName);
    const success = employeePropertyValue === undefined
        ? await setEmployeeProperty(request.body, false, request.session)
        : false;
    const employeeProperties = await getEmployeeProperties(request.body.employeeNumber);
    response.json({
        success,
        employeeProperties
    });
}
export default handler;
