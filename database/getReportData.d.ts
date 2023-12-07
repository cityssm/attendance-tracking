import { type ReportParameters } from '../helpers/functions.reports.js';
export declare function getReportData(reportName: string, requestQuery: ReportParameters, user: AttendUser): Promise<unknown[] | undefined>;
export default getReportData;
