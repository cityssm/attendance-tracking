interface CallOutListMemberFilters {
    listId?: string;
    employeeNumber?: string;
}
export declare function updateCallOutListMemberSortKeys(filters: CallOutListMemberFilters, sessionUser: AttendUser): Promise<number>;
export {};
