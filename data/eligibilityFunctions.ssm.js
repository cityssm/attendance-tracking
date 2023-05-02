import '../helpers/polyfills.js';
export const employeeEligibilityFunctions = [
    {
        functionName: 'Has Property',
        eligibilityFunction(employee, employeePropertyName) {
            const propertyNameLower = employeePropertyName?.toLowerCase();
            return (employee.employeeProperties?.some((possibleProperty) => {
                return (possibleProperty.propertyName.toLowerCase() === propertyNameLower);
            }) ?? false);
        }
    },
    {
        functionName: 'Operator - All Job Classes',
        eligibilityFunction(employee) {
            const jobTitle = (employee.jobTitle ?? '').toLowerCase();
            return jobTitle.startsWith('operator ');
        }
    },
    {
        functionName: 'Operator - JC 6',
        eligibilityFunction(employee) {
            const jobTitle = (employee.jobTitle ?? '').toLowerCase();
            return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 6');
        }
    },
    {
        functionName: 'Operator - JC 7',
        eligibilityFunction(employee) {
            const jobTitle = (employee.jobTitle ?? '').toLowerCase();
            return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 7');
        }
    },
    {
        functionName: 'Operator - JC 8',
        eligibilityFunction(employee) {
            const jobTitle = (employee.jobTitle ?? '').toLowerCase();
            return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 8');
        }
    }
];
