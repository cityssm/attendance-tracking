import type * as recordTypes from '../types/recordTypes';
interface GetCallOutListsFilters {
    favouriteOnly: boolean;
}
export declare function getCallOutLists(filters: GetCallOutListsFilters, requestSession: recordTypes.PartialSession): Promise<recordTypes.CallOutList[]>;
export {};
