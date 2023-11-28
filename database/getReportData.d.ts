export type ReportParameters = Record<string, string | number>;
export declare function getReportData(reportName: string, reportParameters: ReportParameters | undefined, user: MonTYUser): Promise<unknown[] | undefined>;
export default getReportData;
