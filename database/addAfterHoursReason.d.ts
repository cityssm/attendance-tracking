import type * as recordTypes from '../types/recordTypes';
interface AddAfterHGoursReasonForm {
    afterHoursReason: string;
}
export declare function addAfterHoursReason(form: AddAfterHGoursReasonForm, requestSession: recordTypes.PartialSession): Promise<number>;
export {};