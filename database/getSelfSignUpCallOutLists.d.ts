import type { CallOutList } from '../types/recordTypes.js';
interface GetSelfSignUpCallOutListsFilters {
    hasEmployeeNumber?: string;
    doesNotHaveEmployeeNumber?: string;
}
export declare function getSelfSignUpCallOutLists(filters?: GetSelfSignUpCallOutListsFilters): Promise<CallOutList[]>;
export {};
