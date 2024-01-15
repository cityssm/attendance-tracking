import { isAbuser, recordAbuse } from '@cityssm/express-abuse-points';
import { validateEmployeeFields } from '../../helpers/functions.selfService.js';
export async function handler(request, response) {
    const employee = await validateEmployeeFields(request);
    if (!employee.success) {
        recordAbuse(request);
        const isAbuserBoolean = await isAbuser(request);
        response.json({
            success: false,
            isAbuser: isAbuserBoolean,
            errorMessage: employee.errorMessage
        });
        return;
    }
    response.json({
        success: true,
        employeeName: `${employee.employeeSurname ?? ''}, ${employee.employeeGivenName ?? ''}`
    });
}
export default handler;
