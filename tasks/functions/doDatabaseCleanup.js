import Debug from 'debug';
import { moveRecordsToHistorical } from '../../database/moveRecordsToHistorical.js';
import { purgeDeletedRecords } from '../../database/purgeDeletedRecords.js';
const debug = Debug('attendance-tracking:task:databaseCleanup');
export async function doDatabaseCleanup() {
    const archivedRecordsCount = await moveRecordsToHistorical();
    debug(`${archivedRecordsCount.toString()} records archived.`);
    const deletedRecordsCount = await purgeDeletedRecords();
    debug(`${deletedRecordsCount.toString()} records permanently deleted.`);
}
