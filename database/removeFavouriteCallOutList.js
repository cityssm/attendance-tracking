import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function removeFavouriteCallOutList(listId, sessionUser) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    await pool
        .request()
        .input('userName', sessionUser.userName)
        .input('listId', listId).query(`delete from MonTY.FavouriteCallOutLists
      where userName = @userName
      and listId = @listId`);
    return true;
}
