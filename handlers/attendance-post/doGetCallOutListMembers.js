import { getAbsenceRecords } from '../../database/getAbsenceRecords.js';
import { getCallOutList } from '../../database/getCallOutList.js';
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js';
import { getEmployees } from '../../database/getEmployees.js';
import { hasPermission } from '../../helpers/functions.permissions.js';
export async function handler(request, response) {
    const listId = request.body.listId;
    const callOutListMembers = await getCallOutListMembers({ listId }, {});
    let absenceRecords = [];
    let availableEmployees = [];
    if (hasPermission(request.session.user, 'attendance.callOuts.canManage')) {
        if (request.body.includeAvailableEmployees) {
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
        if (hasPermission(request.session.user, 'attendance.absences.canView')) {
            absenceRecords = await getAbsenceRecords({
                recentOnly: true,
                todayOnly: true
            }, {}, request.session.user);
        }
    }
    const responseJson = {
        callOutListMembers,
        availableEmployees,
        absenceRecords
    };
    response.json(responseJson);
}
export default handler;
