import { deleteCallOutListMember } from '../../database/deleteCallOutListMember.js';
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js';
export async function handler(request, response) {
    const success = await deleteCallOutListMember(request.body.listId, request.body.employeeNumber, request.session.user);
    const callOutListMembers = await getCallOutListMembers({ listId: request.body.listId }, {});
    const responseJson = {
        success,
        callOutListMembers
    };
    response.json(responseJson);
}
export default handler;
