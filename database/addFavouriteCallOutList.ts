import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes'

export async function addFavouriteCallOutList(
  listId: string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  try {
    await pool
      .request()
      .input('userName', requestSession.user?.userName)
      .input('listId', listId).query(`insert into MonTY.FavouriteCallOutLists
      (userName, listId)
      values (@userName, @listId)`)

    return true
  } catch {
    return false
  }
}
