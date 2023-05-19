type RecordTable = 'AbsenceTypes' | 'AfterHoursReasons' | 'CallOutResponseTypes';
export declare function updateRecordOrderNumber(recordTable: RecordTable, recordId: number | string, orderNumber: number | string): Promise<boolean>;
export {};
