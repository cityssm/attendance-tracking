import { deleteCallOutList } from '../../database/deleteCallOutList.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
export async function handler(request, response) {
    const success = await deleteCallOutList(request.body.listId, request.session.user);
    const callOutLists = await getCallOutLists({ favouriteOnly: false }, request.session.user);
    const responseJson = {
        success,
        callOutLists
    };
    response.json(responseJson);
}
export default handler;
