import { updateCallOutList } from '../../database/updateCallOutList.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js';
import { getEmployees } from '../../database/getEmployees.js';
export async function handler(request, response) {
    const success = await updateCallOutList(request.body, request.session);
    const callOutLists = await getCallOutLists({ favouriteOnly: false }, request.session);
    const callOutListMembers = await getCallOutListMembers({
        listId: request.body.listId
    }, {
        includeSortKeyFunction: false
    });
    const availableEmployees = await getEmployees({
        eligibilityFunction: {
            functionName: request.body.eligibilityFunction ?? '',
            employeePropertyName: request.body.employeePropertyName ?? ''
        },
        isActive: true
    }, {
        includeProperties: false,
        orderBy: 'name'
    });
    response.json({
        success,
        callOutLists,
        callOutListMembers,
        availableEmployees
    });
}
export default handler;
