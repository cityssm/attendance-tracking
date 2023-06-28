import * as sqlPool from '@cityssm/mssql-multi-pool'

import * as configFunctions from '../helpers/functions.config.js'
import type * as recordTypes from '../types/recordTypes'

export async function removeFavouriteCallOutList(
  listId: string,
  sessionUser: recordTypes.User
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  await pool
    .request()
    .input('userName', sessionUser.userName)
    .input('listId', listId).query(`delete from MonTY.FavouriteCallOutLists
        where userName = @userName
        and listId = @listId`)

  return true
}
