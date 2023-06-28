import type * as recordTypes from '../types/recordTypes';
interface AddAfterHoursRecordForm {
    employeeNumber: string;
    employeeName: string;
    attendanceDateString?: string;
    attendanceTimeString?: string;
    afterHoursReasonId: string;
    recordComment: string;
}
export declare function addAfterHoursRecord(form: AddAfterHoursRecordForm, sessionUser: recordTypes.User): Promise<string>;
export {};
