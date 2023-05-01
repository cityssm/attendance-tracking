import { deleteCallOutListMember } from '../../database/deleteCallOutListMember.js';
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js';
export async function handler(request, response) {
    const success = await deleteCallOutListMember(request.body.listId, request.body.employeeNumber, request.session);
    const callOutListMembers = await getCallOutListMembers(request.body.listId);
    response.json({
        success,
        callOutListMembers
    });
}
export default handler;
