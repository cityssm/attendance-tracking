import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'

export async function deleteCallOutRecord(
  recordId: string,
  sessionUser: AttendUser
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result = await pool
    .request()
    .input('recordId', recordId)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.CallOutRecords
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where recordId = @recordId
      ${
        sessionUser.isAdmin ?? false
          ? ''
          : ' and recordCreate_userName = @record_userName'
      }
      and recordDelete_dateTime is null`)

  return result.rowsAffected[0] > 0
}
