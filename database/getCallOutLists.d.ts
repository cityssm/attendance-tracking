import type { CallOutList } from '../types/recordTypes.js';
interface GetCallOutListsFilters {
    favouriteOnly: boolean;
    allowSelfSignUp?: boolean;
}
export declare function getCallOutLists(filters: GetCallOutListsFilters, sessionUser: MonTYUser): Promise<CallOutList[]>;
export {};
