import { addCallOutListMember } from '../../database/addCallOutListMember.js';
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js';
export async function handler(request, response) {
    const success = await addCallOutListMember(request.body.listId, request.body.employeeNumber, request.session);
    const callOutListMembers = await getCallOutListMembers({ listId: request.body.listId }, {});
    response.json({
        success,
        callOutListMembers
    });
}
export default handler;
