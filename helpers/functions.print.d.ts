interface PrintConfig {
    title: string;
    params: string[];
}
export declare function getScreenPrintConfig(printName: string): PrintConfig | undefined;
export declare function getReportData(printConfig: PrintConfig, requestQuery: Record<string, unknown>, sessionUser: AttendUser): Promise<Record<string, unknown>>;
export {};
