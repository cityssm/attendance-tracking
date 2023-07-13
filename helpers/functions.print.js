import { getCallOutList } from '../database/getCallOutList.js';
import { getCallOutListMembers } from '../database/getCallOutListMembers.js';
import * as permissionFunctions from './functions.permissions.js';
const screenPrintConfigs = {
    callOutList: {
        title: 'Call Out List',
        params: ['listId']
    }
};
export function getScreenPrintConfig(printName) {
    return screenPrintConfigs[printName];
}
export async function getReportData(printConfig, requestQuery, sessionUser) {
    const reportData = {
        headTitle: printConfig.title
    };
    if (printConfig.params.includes('listId') &&
        typeof requestQuery.listId === 'string' &&
        permissionFunctions.hasPermission(sessionUser, 'attendance.callOuts.canView')) {
        const callOutList = await getCallOutList(requestQuery.listId);
        const callOutListMembers = await getCallOutListMembers({
            listId: requestQuery.listId
        }, {
            includeSortKeyFunction: true
        });
        reportData.callOutList = callOutList;
        reportData.callOutListMembers = callOutListMembers;
    }
    return reportData;
}
