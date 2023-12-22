export interface AddCallOutResponseTypeForm {
    responseType: string;
    isSuccessful: '0' | '1';
}
export declare function addCallOutResponseType(form: AddCallOutResponseTypeForm, sessionUser: AttendUser): Promise<string>;
