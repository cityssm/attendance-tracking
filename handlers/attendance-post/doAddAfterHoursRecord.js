import { addAfterHoursRecord } from '../../database/addAfterHoursRecord.js';
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js';
export async function handler(request, response) {
    const recordId = await addAfterHoursRecord(request.body, request.session.user);
    const afterHoursRecords = await getAfterHoursRecords({
        recentOnly: true,
        todayOnly: false
    }, request.session.user);
    response.json({
        success: true,
        recordId,
        afterHoursRecords
    });
}
export default handler;
