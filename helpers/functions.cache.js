import cluster from 'node:cluster';
import Debug from 'debug';
import { getAbsenceTypes as getAbsenceTypesFromDatabase } from '../database/getAbsenceTypes.js';
import { getAfterHoursReasons as getAfterHoursReasonsFromDatabase } from '../database/getAfterHoursReasons.js';
import { getCallOutResponseTypes as getCallOutResponseTypesFromDatabase } from '../database/getCallOutResponseTypes.js';
import { getEmployeePropertyNames as getEmployeePropertyNamesFromDatabase } from '../database/getEmployeePropertyNames.js';
const debug = Debug(`monty:functions.cache:${process.pid}`);
let absenceTypes;
export async function getAbsenceTypes() {
    if (absenceTypes === undefined) {
        debug('Cache miss: AbsenceTypes');
        absenceTypes = await getAbsenceTypesFromDatabase();
    }
    return absenceTypes;
}
let afterHoursReasons;
export async function getAfterHoursReasons() {
    if (afterHoursReasons === undefined) {
        debug('Cache miss: AfterHoursReasons');
        afterHoursReasons = await getAfterHoursReasonsFromDatabase();
    }
    return afterHoursReasons;
}
let callOutResponseTypes;
export async function getCallOutResponseTypes() {
    if (callOutResponseTypes === undefined) {
        debug('Cache miss: CallOutResponseTypes');
        callOutResponseTypes = await getCallOutResponseTypesFromDatabase();
    }
    return callOutResponseTypes;
}
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
        case 'AbsenceTypes': {
            absenceTypes = undefined;
            break;
        }
        case 'AfterHoursReasons': {
            afterHoursReasons = undefined;
            break;
        }
        case 'CallOutResponseTypes': {
            callOutResponseTypes = undefined;
            break;
        }
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
    catch {
    }
}
process.on('message', (message) => {
    if (message.messageType === 'clearCache' && message.pid !== process.pid) {
        debug(`Clearing cache: ${message.tableName}`);
        clearCacheByTableName(message.tableName, false);
    }
});
