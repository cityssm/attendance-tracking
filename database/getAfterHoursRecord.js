import { getAfterHoursRecords } from './getAfterHoursRecords.js';
export async function getAfterHoursRecord(recordId, sessionUser) {
    const afterHoursRecords = await getAfterHoursRecords({
        recordId,
        recentOnly: false,
        todayOnly: false
    }, sessionUser);
    if (afterHoursRecords.length > 0) {
        return afterHoursRecords[0];
    }
    return undefined;
}
