import { getReturnToWorkRecords } from './getReturnToWorkRecords.js';
export async function getReturnToWorkRecord(recordId, requestSession) {
    const returnToWorkRecords = await getReturnToWorkRecords({
        recordId,
        recentOnly: false,
        todayOnly: false
    }, requestSession);
    if (returnToWorkRecords.length > 0) {
        return returnToWorkRecords[0];
    }
    return undefined;
}
