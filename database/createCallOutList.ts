import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'
import type { CallOutList } from '../types/recordTypes.js'

export async function createCallOutList(
  callOutList: CallOutList,
  sessionUser: AttendUser
): Promise<string> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result: IResult<{ listId: string }> = await pool
    .request()
    .input('listName', callOutList.listName)
    .input('listDescription', callOutList.listDescription)
    .input('sortKeyFunction', callOutList.sortKeyFunction)
    .input('eligibilityFunction', callOutList.eligibilityFunction)
    .input('record_userName', sessionUser.userName)
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
