import type * as recordTypes from '../types/recordTypes';
interface AddAfterHGoursReasonForm {
    afterHoursReason: string;
}
export declare function addAfterHoursReason(form: AddAfterHGoursReasonForm, sessionUser: recordTypes.User): Promise<number>;
export {};
