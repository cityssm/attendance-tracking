import type * as recordTypes from '../types/recordTypes';
interface UpdateCallOutListReturn {
    success: boolean;
    sortKeyFunctionChanged: boolean;
    eligibilityFunctionChanged: boolean;
}
export declare function updateCallOutList(callOutList: recordTypes.CallOutList, sessionUser: recordTypes.User): Promise<UpdateCallOutListReturn>;
export {};
