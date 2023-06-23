import { config } from '../data/config.js';
import { getEmployees } from '../database/getEmployees.js';
export const testAdmin = (config.tempUsers ?? []).find((possibleUser) => {
    return possibleUser.user.canLogin && possibleUser.user.isAdmin;
});
if (testAdmin === undefined) {
    console.error('No testAdmin user available.');
}
export const testUser = (config.tempUsers ?? []).find((possibleUser) => {
    return (possibleUser.user.canLogin &&
        !possibleUser.user.isAdmin &&
        possibleUser.user.permissions['attendance.absences.canUpdate'] === 'true');
});
if (testUser === undefined) {
    console.error('No testUser available');
}
export async function getSelfServiceUser() {
    let employeeNumber = '';
    let employeeHomeContactLastFourDigitsValid = '';
    let employeeHomeContactLastFourDigitsInvalid = '';
    const employees = await getEmployees({
        isActive: true
    }, {
        includeProperties: false
    });
    for (const employee of employees) {
        employeeNumber = employee.employeeNumber;
        const possibleFourDigits1 = (employee.homeContact1 ?? '').slice(-4);
        const possibleFourDigits2 = (employee.homeContact2 ?? '').slice(-4);
        if (/\d{4}/.test(possibleFourDigits1)) {
            employeeHomeContactLastFourDigitsValid = possibleFourDigits1;
        }
        else if (/\d{4}/.test(possibleFourDigits2)) {
            employeeHomeContactLastFourDigitsValid = possibleFourDigits2;
        }
        else {
            continue;
        }
        let counter = 1000;
        while (employeeHomeContactLastFourDigitsInvalid === '' ||
            employeeHomeContactLastFourDigitsInvalid ===
                employeeHomeContactLastFourDigitsValid) {
            employeeHomeContactLastFourDigitsInvalid = counter.toString();
            counter += 1;
        }
        break;
    }
    return {
        employeeNumber,
        employeeHomeContactLastFourDigits: {
            valid: employeeHomeContactLastFourDigitsValid,
            invalid: employeeHomeContactLastFourDigitsInvalid
        }
    };
}
export const portNumber = 7000;
