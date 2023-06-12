interface ValidatedEmployee {
    employeeNumber: string;
    employeeSurname: string;
    employeeGivenName: string;
}
export declare function getValidatedEmployee(employeeNumberEnd: string, homeContactEnd: string): Promise<ValidatedEmployee | undefined>;
export {};
