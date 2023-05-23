import * as dateTimeFunctions from '@cityssm/utils-datetime';
export const eligibility_hasProperty = {
    functionName: 'Has Property',
    eligibilityFunction(employee, employeePropertyName) {
        const propertyNameLower = employeePropertyName?.toLowerCase();
        return (employee.employeeProperties?.some((possibleProperty) => {
            return possibleProperty.propertyName.toLowerCase() === propertyNameLower;
        }) ?? false);
    }
};
export const sortKey_alphabetical = {
    functionName: 'Alphabetical',
    sortKeyFunction(employee) {
        return `${employee.employeeSurname.toLowerCase()} ${employee.employeeGivenName.toLowerCase()} ${employee.employeeNumber}`;
    }
};
export const sortKey_propertyValue = {
    functionName: 'Property Value',
    sortKeyFunction(employee, employeePropertyName) {
        const propertyNameLower = employeePropertyName?.toLowerCase();
        const property = employee.employeeProperties?.find((possibleProperty) => {
            return possibleProperty.propertyName.toLowerCase() === propertyNameLower;
        });
        if (property === undefined) {
            return '';
        }
        return property.propertyValue;
    }
};
export const sortKey_seniorityDate = {
    functionName: 'Seniority Date',
    sortKeyFunction(employee) {
        return employee.seniorityDateTime === undefined
            ? '9999-99-99'
            : dateTimeFunctions.dateToString(employee.seniorityDateTime);
    }
};
