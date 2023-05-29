import * as configFunctions from '../../helpers/functions.config.js';
import { getReportData, getScreenPrintConfig } from '../../helpers/functions.print.js';
export async function handler(request, response) {
    const printName = request.params.printName;
    const printConfig = getScreenPrintConfig(printName);
    if (printConfig === undefined) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=printNotFound');
        return;
    }
    const reportData = await getReportData(printConfig, request.query, request.session);
    response.render(`print/screen/${printName}`, reportData);
}
export default handler;
