import type * as recordTypes from '../types/recordTypes.js';
interface AddAbsenceRecordForm {
    employeeNumber: string;
    employeeName: string;
    absenceDateString: string;
    absenceTypeKey: string;
    returnDateString: string;
    recordComment: string;
}
export declare function addAbsenceRecord(form: AddAbsenceRecordForm, requestSession: recordTypes.PartialSession): Promise<string>;
export {};
