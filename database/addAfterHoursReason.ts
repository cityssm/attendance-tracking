import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes.js'
import type { IResult } from 'mssql'

interface AddAfterHGoursReasonForm {
  afterHoursReason: string
}

export async function addAfterHoursReason(
  form: AddAfterHGoursReasonForm,
  requestSession: recordTypes.PartialSession
): Promise<number> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result: IResult<{ afterHoursReasonId: number }> = await pool
    .request()
    .input('afterHoursReason', form.afterHoursReason)
    .input('orderNumber', -1)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date())
    .query(`insert into MonTY.AfterHoursReasons
      (afterHoursReason, orderNumber,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.afterHoursReasonId
      values (@afterHoursReason, @orderNumber,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  return result.recordset[0].afterHoursReasonId
}
