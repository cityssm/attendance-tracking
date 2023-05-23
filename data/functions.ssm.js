export const eligibility_unionized = {
    functionName: 'Unionized Employees',
    eligibilityFunction(employee, employeePropertyName) {
        const payGroup = employee.employeeProperties?.find((possibleProperty) => {
            return possibleProperty.propertyName.toLowerCase() === 'paygroup';
        });
        if (payGroup !== undefined &&
            ['310', '311'].includes(payGroup.propertyValue)) {
            return true;
        }
        return false;
    }
};
export const eligibility_operator = {
    functionName: 'Operator - All Job Classes',
    eligibilityFunction(employee) {
        const jobTitle = (employee.jobTitle ?? '').toLowerCase();
        return jobTitle.startsWith('operator ');
    }
};
export const eligibility_operatorJC6 = {
    functionName: 'Operator - JC 6',
    eligibilityFunction(employee) {
        const jobTitle = (employee.jobTitle ?? '').toLowerCase();
        return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 6');
    }
};
export const eligibility_operatorJC7 = {
    functionName: 'Operator - JC 7',
    eligibilityFunction(employee) {
        const jobTitle = (employee.jobTitle ?? '').toLowerCase();
        return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 7');
    }
};
export const eligibility_operatorJC8 = {
    functionName: 'Operator - JC 8',
    eligibilityFunction(employee) {
        const jobTitle = (employee.jobTitle ?? '').toLowerCase();
        return jobTitle.startsWith('operator ') && jobTitle.endsWith(' 8');
    }
};
