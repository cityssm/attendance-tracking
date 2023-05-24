import type * as recordTypes from '../types/recordTypes.js';
interface AddAfterHoursRecordForm {
    employeeNumber: string;
    employeeName: string;
    attendanceDateString?: string;
    attendanceTimeString?: string;
    afterHoursReasonId: string;
    recordComment: string;
}
export declare function addAfterHoursRecord(form: AddAfterHoursRecordForm, requestSession: recordTypes.PartialSession): Promise<string>;
export {};
