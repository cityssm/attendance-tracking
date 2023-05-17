import { addFavouriteCallOutList } from '../../database/addFavouriteCallOutList.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
export async function handler(request, response) {
    const success = await addFavouriteCallOutList(request.body.listId, request.session);
    const callOutLists = await getCallOutLists(request.session);
    response.json({
        success,
        callOutLists
    });
}
export default handler;
