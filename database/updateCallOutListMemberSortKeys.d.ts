import '../helpers/polyfills.js';
import type * as recordTypes from '../types/recordTypes';
interface CallOutListMemberFilters {
    listId?: string;
    employeeNumber?: string;
}
export declare function updateCallOutListMemberSortKeys(filters: CallOutListMemberFilters, requestSession: recordTypes.PartialSession): Promise<number>;
export {};
