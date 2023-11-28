import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'

interface EditCallOutRecordForm {
  recordId: string
  employeeNumber: string
  callOutDateString: string
  callOutTimeString: string
  callOutHours: string
  natureOfCallOut: string
  responseTypeId: string
  recordComment: string
}

export async function updateCallOutRecord(
  form: EditCallOutRecordForm,
  sessionUser: AttendUser
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const callOutDateTimeString = `${form.callOutDateString} ${form.callOutTimeString}`

  const result: IResult<{ recordId: string }> = await pool
    .request()
    .input('recordId', form.recordId)
    .input(
      'callOutDateTime',
      callOutDateTimeString === '' ? new Date() : callOutDateTimeString
    )
    .input('callOutHours', form.callOutHours)
    .input('natureOfCallOut', form.natureOfCallOut)
    .input('responseTypeId', form.responseTypeId)
    .input('recordComment', form.recordComment)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date()).query(`update MonTY.CallOutRecords
      set callOutDateTime = @callOutDateTime,
        callOutHours = @callOutHours,
        natureOfCallOut = @natureOfCallOut,
        responseTypeId = @responseTypeId,
        recordComment = @recordComment,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      where recordId = @recordId
        and recordDelete_dateTime is null`)

  return result.rowsAffected[0] > 0
}
