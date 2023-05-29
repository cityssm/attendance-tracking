import cluster from 'node:cluster';
import Debug from 'debug';
import { getEmployeePropertyNames as getEmployeePropertyNamesFromDatabase } from '../database/getEmployeePropertyNames.js';
const debug = Debug(`monty:functions.cache:${process.pid}`);
let employeeProperties;
export async function getEmployeePropertyNames() {
    if (employeeProperties === undefined) {
        debug('Cache miss: EmployeeProperties');
        employeeProperties = await getEmployeePropertyNamesFromDatabase();
    }
    return employeeProperties;
}
export function clearCacheByTableName(tableName, relayMessage = true) {
    switch (tableName) {
        case 'EmployeeProperties': {
            employeeProperties = undefined;
            break;
        }
    }
    try {
        if (relayMessage && cluster.isWorker) {
            const workerMessage = {
                messageType: 'clearCache',
                tableName,
                timeMillis: Date.now(),
                pid: process.pid
            };
            debug(`Sending clear cache from worker: ${tableName}`);
            process.send(workerMessage);
        }
    }
    catch { }
}
process.on('message', (message) => {
    if (message.messageType === 'clearCache' && message.pid !== process.pid) {
        debug(`Clearing cache: ${message.tableName}`);
        clearCacheByTableName(message.tableName, false);
    }
});
