interface PrintConfig {
    title: string;
    params: string[];
}
declare const screenPrintConfigs: Record<string, PrintConfig>;
export declare function getScreenPrintConfig(printName: keyof typeof screenPrintConfigs | string): PrintConfig | undefined;
export declare function getReportData(printConfig: PrintConfig, requestQuery: Record<string, unknown>, sessionUser: AttendUser): Promise<Record<string, unknown>>;
export {};
