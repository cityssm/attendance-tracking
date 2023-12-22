import { addFavouriteCallOutList } from '../../database/addFavouriteCallOutList.js';
import { getCallOutLists } from '../../database/getCallOutLists.js';
import { removeFavouriteCallOutList } from '../../database/removeFavouriteCallOutList.js';
export async function doAddFavouriteCallOutListHandler(request, response) {
    const success = await addFavouriteCallOutList(request.body.listId, request.session.user);
    const callOutLists = await getCallOutLists({ favouriteOnly: false }, request.session.user);
    const responseJson = {
        success,
        callOutLists
    };
    response.json(responseJson);
}
export async function doRemoveFavouriteCallOutListHandler(request, response) {
    const success = await removeFavouriteCallOutList(request.body.listId, request.session.user);
    const callOutLists = await getCallOutLists({ favouriteOnly: false }, request.session.user);
    const responseJson = {
        success,
        callOutLists
    };
    response.json(responseJson);
}
