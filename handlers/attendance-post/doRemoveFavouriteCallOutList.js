import { removeFavouriteCallOutList } from '../../database/removeFavouriteCallOutList.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
export async function handler(request, response) {
    const success = await removeFavouriteCallOutList(request.body.listId, request.session);
    const callOutLists = await getCallOutLists({ favouriteOnly: false }, request.session);
    response.json({
        success,
        callOutLists
    });
}
export default handler;
