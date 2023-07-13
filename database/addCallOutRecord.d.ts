interface AddCallOutRecordForm {
    listId: string;
    employeeNumber: string;
    callOutDateString?: string;
    callOutTimeString?: string;
    callOutHours: string;
    responseTypeId: string;
    recordComment: string;
}
export declare function addCallOutRecord(form: AddCallOutRecordForm, sessionUser: MonTYUser): Promise<string>;
export {};
