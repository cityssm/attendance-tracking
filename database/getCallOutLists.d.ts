import type { CallOutList } from '../types/recordTypes.js';
interface GetCallOutListsFilters {
    favouriteOnly: boolean;
    allowSelfSignUp?: boolean;
    employeeNumber?: string;
}
export declare function getCallOutLists(filters: GetCallOutListsFilters, sessionUser: AttendUser): Promise<CallOutList[]>;
export {};
