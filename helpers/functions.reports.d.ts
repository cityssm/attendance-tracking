import { type availablePermissionKeys } from './functions.permissions.js';
export type ReportParameters = Record<string, string | number>;
interface ReportDefinition {
    sql: string;
    permissions: availablePermissionKeys[];
    inputs?: (requestQuery: ReportParameters) => ReportParameters;
}
export declare function getReportDefinition(reportName: string): ReportDefinition | undefined;
export {};
