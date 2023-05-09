import { getReportData } from '../../database/getReportData.js';
import papaparse from 'papaparse';
export async function handler(request, response) {
    const reportName = request.params.reportName;
    let rows;
    switch (reportName) {
        default: {
            rows = await getReportData(reportName, request.query);
            break;
        }
    }
    if (rows === undefined) {
        response.status(404).json({
            success: false,
            message: 'Report Not Found'
        });
        return;
    }
    const csv = papaparse.unparse(rows);
    response.setHeader('Content-Disposition', `attachment; filename=${reportName}-${Date.now().toString()}.csv`);
    response.setHeader('Content-Type', 'text/csv');
    response.send(csv);
}
export default handler;
