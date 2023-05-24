import type * as recordTypes from '../types/recordTypes.js';
interface AddCallOutRecordForm {
    listId: string;
    employeeNumber: string;
    callOutDateString?: string;
    callOutTimeString?: string;
    callOutHours: string;
    responseTypeId: string;
    recordComment: string;
}
export declare function addCallOutRecord(form: AddCallOutRecordForm, requestSession: recordTypes.PartialSession): Promise<string>;
export {};
