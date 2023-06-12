import type * as recordTypes from '../types/recordTypes';
interface GetSelfSignUpCallOutListsFilters {
    hasEmployeeNumber?: string;
    doesNotHaveEmployeeNumber?: string;
}
export declare function getSelfSignUpCallOutLists(filters?: GetSelfSignUpCallOutListsFilters): Promise<recordTypes.CallOutList[]>;
export {};
