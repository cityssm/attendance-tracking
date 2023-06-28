import { getReturnToWorkRecords } from './getReturnToWorkRecords.js';
export async function getReturnToWorkRecord(recordId, sessionUser) {
    const returnToWorkRecords = await getReturnToWorkRecords({
        recordId,
        recentOnly: false,
        todayOnly: false
    }, sessionUser);
    if (returnToWorkRecords.length > 0) {
        return returnToWorkRecords[0];
    }
    return undefined;
}
