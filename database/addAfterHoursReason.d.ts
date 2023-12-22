export interface AddAfterHoursReasonForm {
    afterHoursReason: string;
}
export declare function addAfterHoursReason(form: AddAfterHoursReasonForm, sessionUser: AttendUser): Promise<number>;
