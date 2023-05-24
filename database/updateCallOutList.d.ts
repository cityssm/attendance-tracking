import type * as recordTypes from '../types/recordTypes.js';
interface UpdateCallOutListReturn {
    success: boolean;
    sortKeyFunctionChanged: boolean;
    eligibilityFunctionChanged: boolean;
}
export declare function updateCallOutList(callOutList: recordTypes.CallOutList, requestSession: recordTypes.PartialSession): Promise<UpdateCallOutListReturn>;
export {};
