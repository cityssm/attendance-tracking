interface EditCallOutRecordForm {
    recordId: string;
    employeeNumber: string;
    callOutDateString: string;
    callOutTimeString: string;
    callOutHours: string;
    natureOfCallOut: string;
    responseTypeId: string;
    recordComment: string;
}
export declare function updateCallOutRecord(form: EditCallOutRecordForm, sessionUser: MonTYUser): Promise<boolean>;
export {};
