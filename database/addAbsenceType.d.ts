interface AddAbsenceTypeForm {
    absenceType: string;
}
export declare function addAbsenceType(form: AddAbsenceTypeForm, sessionUser: AttendUser): Promise<string>;
export {};
