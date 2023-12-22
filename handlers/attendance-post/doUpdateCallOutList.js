import { getCallOutListMembers } from '../../database/getCallOutListMembers.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
import { getEmployees } from '../../database/getEmployees.js';
import { updateCallOutList } from '../../database/updateCallOutList.js';
export async function handler(request, response) {
    const updateResponse = await updateCallOutList(request.body, request.session.user);
    const callOutLists = await getCallOutLists({ favouriteOnly: false }, request.session.user);
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
    const responseJson = {
        success: updateResponse.success,
        callOutLists,
        callOutListMembers,
        availableEmployees
    };
    response.json(responseJson);
}
export default handler;
