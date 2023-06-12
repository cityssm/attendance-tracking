import { getValidatedEmployee } from '../database/getValidatedEmployee.js';
import * as configFunctions from './functions.config.js';
export async function validateEmployeeFields(request) {
    const employeeNumber = request.body.employeeNumber;
    const employeeHomeContactLastFourDigits = request.body.employeeHomeContactLastFourDigits;
    if ((employeeNumber ?? '') === '') {
        return {
            success: false,
            errorMessage: 'No employee number.'
        };
    }
    if ((employeeHomeContactLastFourDigits ?? '').length !== 4) {
        return {
            success: false,
            errorMessage: 'Invalid home contact number.'
        };
    }
    const employeeNumberRegularExpression = configFunctions.getProperty('settings.employeeNumberRegularExpression');
    if (employeeNumberRegularExpression !== undefined &&
        !employeeNumberRegularExpression.test(employeeNumber)) {
        return {
            success: false,
            errorMessage: 'Invalid employee number.'
        };
    }
    const employee = await getValidatedEmployee(employeeNumber, employeeHomeContactLastFourDigits);
    if (employee === undefined) {
        return {
            success: false,
            errorMessage: 'Employee not found.'
        };
    }
    return {
        success: true,
        employeeNumber: employee.employeeNumber,
        employeeGivenName: employee.employeeGivenName,
        employeeSurname: employee.employeeSurname
    };
}
