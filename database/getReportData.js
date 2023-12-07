import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
import { hasPermission } from '../helpers/functions.permissions.js';
import { getReportDefinition } from '../helpers/functions.reports.js';
export async function getReportData(reportName, requestQuery, user) {
    const report = getReportDefinition(reportName);
    if (report === undefined) {
        return undefined;
    }
    for (const permission of report.permissions) {
        if (!hasPermission(user, permission)) {
            return undefined;
        }
    }
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    let request = pool.request();
    if (report.inputs !== undefined) {
        const inputs = report.inputs(requestQuery);
        for (const [parameterName, parameterValue] of Object.entries(inputs)) {
            request = request.input(parameterName, parameterValue);
        }
    }
    const result = await request.query(report.sql);
    return result.recordset;
}
export default getReportData;
