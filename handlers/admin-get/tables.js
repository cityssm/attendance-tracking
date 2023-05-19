import { getAbsenceTypes } from '../../database/getAbsenceTypes.js';
import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js';
import { getAfterHoursReasons } from '../../database/getAfterHoursReasons.js';
export async function handler(request, response) {
    const absenceTypes = await getAbsenceTypes();
    const callOutResponseTypes = await getCallOutResponseTypes();
    const afterHoursReasons = await getAfterHoursReasons();
    response.render('admin.tables.ejs', {
        headTitle: 'Table Maintenance',
        absenceTypes,
        callOutResponseTypes,
        afterHoursReasons
    });
}
export default handler;
