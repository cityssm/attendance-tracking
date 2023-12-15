import { getCallOutList } from '../database/getCallOutList.js';
import { getCallOutListMembers } from '../database/getCallOutListMembers.js';
import { hasPermission } from './functions.permissions.js';
const screenPrintConfigs = {
    callOutList: {
        title: 'Call Out List',
        params: ['listIds']
    }
};
export function getScreenPrintConfig(printName) {
    return screenPrintConfigs[printName];
}
export async function getReportData(printConfig, requestQuery, sessionUser) {
    const reportData = {
        headTitle: printConfig.title
    };
    if (printConfig.params.includes('listIds') &&
        typeof requestQuery.listIds === 'string' &&
        hasPermission(sessionUser, 'attendance.callOuts.canView')) {
        const callOutLists = [];
        const callOutListIds = requestQuery.listIds.split(',');
        for (const listId of callOutListIds) {
            const callOutList = await getCallOutList(listId);
            if (callOutList !== undefined) {
                callOutList.callOutListMembers = await getCallOutListMembers({
                    listId
                }, {
                    includeSortKeyFunction: true
                });
                callOutLists.push(callOutList);
            }
        }
        reportData.callOutLists = callOutLists;
    }
    return reportData;
}
