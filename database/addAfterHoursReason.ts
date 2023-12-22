import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import { getConfigProperty } from '../helpers/functions.config.js'

export interface AddAfterHoursReasonForm {
  afterHoursReason: string
}

export async function addAfterHoursReason(
  form: AddAfterHoursReasonForm,
  sessionUser: AttendUser
): Promise<number> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result: IResult<{ afterHoursReasonId: number }> = await pool
    .request()
    .input('afterHoursReason', form.afterHoursReason)
    .input('orderNumber', -1)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .query(`insert into MonTY.AfterHoursReasons
      (afterHoursReason, orderNumber,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.afterHoursReasonId
      values (@afterHoursReason, @orderNumber,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  clearCacheByTableName('AfterHoursReasons')

  return result.recordset[0].afterHoursReasonId
}
