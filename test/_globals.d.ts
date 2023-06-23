export declare const testAdmin: import("../types/configTypes.js").ConfigTemporaryUserCredentials | undefined;
export declare const testUser: import("../types/configTypes.js").ConfigTemporaryUserCredentials | undefined;
export interface TestSelfServiceUser {
    employeeNumber: string;
    employeeHomeContactLastFourDigits: {
        valid: string;
        invalid: string;
    };
}
export declare function getSelfServiceUser(): Promise<TestSelfServiceUser>;
export declare const portNumber = 7000;
