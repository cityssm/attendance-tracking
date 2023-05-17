import type * as recordTypes from '../types/recordTypes';
interface PrintConfig {
    title: string;
    params: string[];
}
export declare function getScreenPrintConfig(printName: string): PrintConfig | undefined;
export declare function getPdfPrintConfig(printName: string): PrintConfig | undefined;
export declare function getPrintConfig(screenOrPdfPrintName: string): PrintConfig | undefined;
export declare function getReportData(printConfig: PrintConfig, requestQuery: Record<string, unknown>, requestSession: recordTypes.PartialSession): Promise<Record<string, unknown>>;
export {};
