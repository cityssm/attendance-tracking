import { getCallOutListMembers } from '../../database/getCallOutListMembers.js';
import { getCallOutList } from '../../database/getCallOutList.js';
import * as permissionFunctions from '../../helpers/functions.permissions.js';
import { getEmployees } from '../../database/getEmployees.js';
export async function handler(request, response) {
    const listId = request.body.listId;
    const callOutListMembers = await getCallOutListMembers({ listId }, {});
    let availableEmployees = [];
    if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canManage') &&
        request.body.includeAvailableEmployees) {
        const callOutList = await getCallOutList(listId);
        availableEmployees = await getEmployees({
            eligibilityFunction: {
                functionName: callOutList?.eligibilityFunction ?? '',
                employeePropertyName: callOutList?.employeePropertyName ?? ''
            },
            isActive: true
        }, {
            includeProperties: false,
            orderBy: 'name'
        });
    }
    response.json({
        callOutListMembers,
        availableEmployees
    });
}
export default handler;
