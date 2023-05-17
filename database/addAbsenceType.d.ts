import type * as recordTypes from '../types/recordTypes';
interface AddAbsenceTypeForm {
    absenceType: string;
}
export declare function addAbsenceType(form: AddAbsenceTypeForm, requestSession: recordTypes.PartialSession): Promise<string>;
export {};
