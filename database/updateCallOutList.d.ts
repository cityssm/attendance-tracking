import type { CallOutList } from '../types/recordTypes.js';
interface UpdateCallOutListReturn {
    success: boolean;
    sortKeyFunctionChanged: boolean;
    eligibilityFunctionChanged: boolean;
}
export declare function updateCallOutList(callOutList: CallOutList, sessionUser: MonTYUser): Promise<UpdateCallOutListReturn>;
export {};
