import type { config as MSSQLConfig } from 'mssql';
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
        urlPrefix?: string;
    };
    activeDirectory?: ConfigActiveDirectory;
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
    };
    settings: {
        printPdf: {
            contentDisposition?: 'attachment' | 'inline';
        };
    };
}
export interface ConfigActiveDirectory {
    url: string;
    baseDN: string;
    username: string;
    password: string;
}
