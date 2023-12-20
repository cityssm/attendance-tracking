import { configDefaultValues } from '../data/configDefaultValues.js';
export declare function getConfigProperty<K extends keyof typeof configDefaultValues>(propertyName: K, fallbackValue?: (typeof configDefaultValues)[K]): (typeof configDefaultValues)[K];
export declare const isLogoOverwritten: boolean;
export declare function includeAttendance(): boolean;
export declare const historicalDays: number;
export declare const deleteDays: number;
export declare const keepAliveMillis: number;
declare const _default: {
    getConfigProperty: typeof getConfigProperty;
    includeAttendance: typeof includeAttendance;
    isLogoOverwritten: boolean;
    historicalDays: number;
    deleteDays: number;
    keepAliveMillis: number;
};
export default _default;
