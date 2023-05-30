import '../helpers/polyfills.js';
import type { CallOutListMember } from '../types/recordTypes';
interface CallOutListMemberFilters {
    listId?: string;
    employeeNumber?: string;
}
interface CallOutListMemberOptions {
    includeSortKeyFunction?: boolean;
}
export declare function getCallOutListMembers(filters: CallOutListMemberFilters, options: CallOutListMemberOptions): Promise<CallOutListMember[]>;
export {};
