import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes'

export async function updateCallOutList(
  callOutList: recordTypes.CallOutList,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result = await pool
    .request()
    .input('listName', callOutList.listName)
    .input('listDescription', callOutList.listDescription)
    .input('sortKeyFunction', callOutList.sortKeyFunction)
    .input('eligibilityFunction', callOutList.eligibilityFunction)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date())
    .input('listId', callOutList.listId)
    .query(`update MonTY.CallOutLists
      set listName = @listName,
      listDescription = @listDescription,
      sortKeyFunction = @sortKeyFunction,
      eligibilityFunction = @eligibilityFunction,
      recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime
      where listId = @listId
      and recordDelete_dateTime is null`)

  return result.rowsAffected[0] > 0
}
