interface AddReturnToWorkRecordForm {
    employeeNumber: string;
    employeeName: string;
    returnDateString: string;
    returnShift: string;
    recordComment: string;
}
export declare function addReturnToWorkRecord(form: AddReturnToWorkRecordForm, sessionUser: AttendUser): Promise<string>;
export {};
