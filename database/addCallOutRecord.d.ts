import type * as recordTypes from '../types/recordTypes';
interface AddCallOutRecordForm {
    listId: string;
    employeeNumber: string;
    callOutDateString?: string;
    callOutTimeString?: string;
    callOutHours: string;
    responseTypeId: string;
    recordComment: string;
}
export declare function addCallOutRecord(form: AddCallOutRecordForm, sessionUser: recordTypes.User): Promise<string>;
export {};
