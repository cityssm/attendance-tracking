import type { config as MSSQLConfig } from 'mssql';
export interface Config {
    application: ConfigApplication;
    session: ConfigSession;
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
    settings: {
        printPdf: {
            contentDisposition?: 'attachment' | 'inline';
        };
    };
}
interface ConfigApplication {
    applicationName?: string;
    backgroundURL?: string;
    logoURL?: string;
    httpPort?: number;
    userDomain?: string;
    maximumProcesses?: number;
}
interface ConfigSession {
    cookieName?: string;
    secret?: string;
    maxAgeMillis?: number;
    doKeepAlive?: boolean;
}
export interface ConfigActiveDirectory {
    url: string;
    baseDN: string;
    username: string;
    password: string;
}
export {};
