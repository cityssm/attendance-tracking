import type * as recordTypes from '../types/recordTypes';
interface AddCallOutResponseTypeForm {
    responseType: string;
    isSuccessful: '0' | '1';
}
export declare function addCallOutResponseType(form: AddCallOutResponseTypeForm, requestSession: recordTypes.PartialSession): Promise<string>;
export {};
