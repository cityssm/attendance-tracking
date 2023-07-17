import { getEmployee } from '../../database/getEmployee.js';
import { getSelfSignUpCallOutLists } from '../../database/getSelfSignUpCallOutLists.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
import { validateEmployeeFields } from '../../helpers/functions.selfService.js';
export async function handler(request, response) {
    const validatedEmployee = await validateEmployeeFields(request);
    if (!validatedEmployee.success) {
        response.json({
            success: false,
            errorMessage: 'Employee not found'
        });
        return;
    }
    const employee = (await getEmployee(validatedEmployee.employeeNumber));
    const eligibilityFunctions = getConfigProperty('settings.employeeEligibilityFunctions');
    const availableCallOutLists = await getSelfSignUpCallOutLists({
        doesNotHaveEmployeeNumber: employee.employeeNumber
    });
    const callOutLists = [];
    for (const callOutList of availableCallOutLists) {
        if ((callOutList.eligibilityFunction ?? '') === '') {
            callOutLists.push(callOutList);
        }
        const eligibilityFunction = eligibilityFunctions.find((possibleFunction) => {
            return callOutList.eligibilityFunction === possibleFunction.functionName;
        });
        if (eligibilityFunction === undefined) {
            continue;
        }
        const isEligible = eligibilityFunction.eligibilityFunction(employee, callOutList.employeePropertyName);
        if (isEligible) {
            callOutLists.push(callOutList);
        }
    }
    response.json({
        callOutLists
    });
}
export default handler;
