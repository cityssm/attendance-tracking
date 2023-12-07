export type ReportParameters = Record<string, string | number>;
export declare function getReportData(reportName: string, reportParameters: ReportParameters, user: AttendUser): Promise<unknown[] | undefined>;
export default getReportData;
