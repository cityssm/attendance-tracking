import '../helpers/polyfills.js';
interface CallOutListMemberFilters {
    listId?: string;
    employeeNumber?: string;
}
export declare function updateCallOutListMemberSortKeys(filters: CallOutListMemberFilters, sessionUser: MonTYUser): Promise<number>;
export {};
