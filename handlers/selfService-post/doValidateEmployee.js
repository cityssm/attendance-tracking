import { validateEmployeeFields } from '../../helpers/functions.selfService.js';
export async function handler(request, response) {
    const employee = await validateEmployeeFields(request);
    if (!employee.success) {
        response.json({
            success: false,
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
