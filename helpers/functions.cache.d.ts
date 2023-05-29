import type { CacheTableName } from '../types/applicationTypes.js';
export declare function getEmployeePropertyNames(): Promise<string[]>;
export declare function clearCacheByTableName(tableName: CacheTableName, relayMessage?: boolean): void;
