import type { CallOutList } from '../types/recordTypes.js';
export interface UpdateCallOutListReturn {
    success: boolean;
    sortKeyFunctionChanged: boolean;
    eligibilityFunctionChanged: boolean;
}
export declare function updateCallOutList(callOutList: CallOutList, sessionUser: AttendUser): Promise<UpdateCallOutListReturn>;
