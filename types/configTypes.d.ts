import type { config as MSSQLConfig } from 'mssql';
import type { Configuration as AvantiConfig } from '@cityssm/avanti-api';
import type { ADWebAuthConfig } from '@cityssm/ad-web-auth-connector/types';
import type { Employee } from './recordTypes';
export interface Config {
    application: {
        applicationName?: string;
        backgroundURL?: string;
        bigLogoURL?: string;
        smallLogoURL?: string;
        httpPort?: number;
        userDomain?: string;
        maximumProcesses?: number;
    };
    session: {
        cookieName?: string;
        secret?: string;
        maxAgeMillis?: number;
        doKeepAlive?: boolean;
    };
    reverseProxy: {
        disableCompression?: boolean;
        disableEtag?: boolean;
        urlPrefix?: `/${string}`;
    };
    activeDirectory?: ConfigActiveDirectory;
    adWebAuthConfig?: ADWebAuthConfig;
    mssql?: MSSQLConfig;
    aliases: {
        lot?: string;
        lots?: string;
        map?: string;
        maps?: string;
        occupancy?: string;
        occupancies?: string;
        occupancyStartDate?: string;
        occupant?: string;
        occupants?: string;
        externalReceiptNumber?: string;
        workOrderOpenDate?: string;
        workOrderCloseDate?: string;
    };
    features: {
        attendance?: {
            absences?: boolean;
            returnsToWork?: boolean;
            callOuts?: boolean;
        };
        employees?: {
            avantiSync?: boolean;
        };
    };
    settings: {
        printPdf: {
            contentDisposition?: 'attachment' | 'inline';
        };
        avantiSync?: {
            config: AvantiConfig;
            locationCodes?: string[];
        };
        employeeSortKeyFunctions?: ConfigEmployeeSortKeyFunction[];
        employeeEligibilityFunctions?: ConfigEmployeeEligibilityFunction[];
        recentDays?: number;
    };
}
export interface ConfigActiveDirectory {
    url: string;
    baseDN: string;
    username: string;
    password: string;
}
export interface ConfigEmployeeSortKeyFunction {
    functionName: string;
    sortKeyFunction: (employee: Employee, employeePropertyName?: string) => string;
}
export interface ConfigEmployeeEligibilityFunction {
    functionName: string;
    eligibilityFunction: (employee: Employee, employeePropertyName?: string) => boolean;
}
