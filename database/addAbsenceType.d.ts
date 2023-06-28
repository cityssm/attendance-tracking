import type * as recordTypes from '../types/recordTypes';
interface AddAbsenceTypeForm {
    absenceType: string;
}
export declare function addAbsenceType(form: AddAbsenceTypeForm, sessionUser: recordTypes.User): Promise<string>;
export {};
