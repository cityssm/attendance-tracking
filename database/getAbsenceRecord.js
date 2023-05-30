import { getAbsenceRecords } from './getAbsenceRecords.js';
export async function getAbsenceRecord(recordId, requestSession) {
    const absenceRecords = await getAbsenceRecords({
        recordId,
        recentOnly: false,
        todayOnly: false
    }, requestSession);
    if (absenceRecords.length > 0) {
        return absenceRecords[0];
    }
    return undefined;
}
