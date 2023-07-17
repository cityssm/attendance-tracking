import * as sqlPool from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'

export async function deleteCallOutListMember(
  listId: string,
  employeeNumber: string,
  sessionUser: MonTYUser
): Promise<boolean> {
  const pool = await sqlPool.connect(getConfigProperty('mssql'))

  const result = await pool
    .request()
    .input('listId', listId)
    .input('employeeNumber', employeeNumber)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.CallOutListMembers
      set recordDelete_userName = @record_userName,
        recordDelete_dateTime = @record_dateTime
      where listId = @listId
        and employeeNumber = @employeeNumber
        and recordDelete_dateTime is null`)

  return result.rowsAffected[0] > 0
}
