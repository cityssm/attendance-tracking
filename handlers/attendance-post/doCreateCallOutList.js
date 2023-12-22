import { createCallOutList } from '../../database/createCallOutList.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
export async function handler(request, response) {
    const listId = await createCallOutList(request.body, request.session.user);
    const callOutLists = await getCallOutLists({ favouriteOnly: false }, request.session.user);
    const responseJson = {
        success: true,
        listId,
        callOutLists
    };
    response.json(responseJson);
}
export default handler;
