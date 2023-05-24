import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes.js'
import type { IResult } from 'mssql'

export async function createCallOutList(
  callOutList: recordTypes.CallOutList,
  requestSession: recordTypes.PartialSession
): Promise<number> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result: IResult<{ listId: number }> = await pool
    .request()
    .input('listName', callOutList.listName)
    .input('listDescription', callOutList.listDescription)
    .input('sortKeyFunction', callOutList.sortKeyFunction)
    .input('eligibilityFunction', callOutList.eligibilityFunction)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date()).query(`insert into MonTY.CallOutLists
      (listName, listDescription,
        sortKeyFunction, eligibilityFunction,
        recordCreate_userName, recordCreate_dateTime,
        recordUpdate_userName, recordUpdate_dateTime)
      output inserted.listId
      values (@listName, @listDescription,
        @sortKeyFunction, @eligibilityFunction,
        @record_userName, @record_dateTime,
        @record_userName, @record_dateTime)`)

  return result.recordset[0].listId
}
