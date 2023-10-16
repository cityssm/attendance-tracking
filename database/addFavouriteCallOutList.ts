import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'

export async function addFavouriteCallOutList(
  listId: string,
  sessionUser: MonTYUser
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  try {
    await pool
      .request()
      .input('userName', sessionUser.userName)
      .input('listId', listId).query(`insert into MonTY.FavouriteCallOutLists
        (userName, listId)
        values (@userName, @listId)`)

    return true
  } catch {
    return false
  }
}
