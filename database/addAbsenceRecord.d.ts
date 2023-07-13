interface AddAbsenceRecordForm {
    employeeNumber: string;
    employeeName: string;
    absenceDateString: string;
    absenceTypeKey: string;
    returnDateString: string;
    recordComment: string;
}
export declare function addAbsenceRecord(form: AddAbsenceRecordForm, sessionUser: MonTYUser): Promise<string>;
export {};
