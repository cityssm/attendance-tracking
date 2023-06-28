import type * as recordTypes from '../types/recordTypes';
interface AddReturnToWorkRecordForm {
    employeeNumber: string;
    employeeName: string;
    returnDateString: string;
    returnShift: string;
    recordComment: string;
}
export declare function addReturnToWorkRecord(form: AddReturnToWorkRecordForm, sessionUser: recordTypes.User): Promise<string>;
export {};
