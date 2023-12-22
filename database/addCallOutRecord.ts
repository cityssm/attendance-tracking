import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'

export interface AddCallOutRecordForm {
  listId: string
  employeeNumber: string
  callOutDateString?: string
  callOutTimeString?: string
  callOutHours: string
  natureOfCallOut: string
  responseTypeId: string
  recordComment: string
}

export async function addCallOutRecord(
  form: AddCallOutRecordForm,
  sessionUser: AttendUser
): Promise<string> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  let callOutDateTimeString = ''

  if (
    form.callOutDateString !== undefined &&
    (form.callOutDateString ?? '') !== ''
  ) {
    callOutDateTimeString = `${form.callOutDateString} ${
      form.callOutTimeString ?? ''
    }`.trim()
  }

  const result: IResult<{ recordId: string }> = await pool
    .request()
    .input('listId', form.listId)
    .input('employeeNumber', form.employeeNumber)
    .input(
      'callOutDateTime',
      callOutDateTimeString === '' ? new Date() : callOutDateTimeString
    )
    .input('callOutHours', form.callOutHours)
    .input('natureOfCallOut', form.natureOfCallOut)
    .input('responseTypeId', form.responseTypeId)
    .input('recordComment', form.recordComment)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .query(`insert into MonTY.CallOutRecords
      (listId, employeeNumber, callOutDateTime, callOutHours, natureOfCallOut, responseTypeId, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@listId, @employeeNumber, @callOutDateTime, @callOutHours, @natureOfCallOut, @responseTypeId, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  return result.recordset[0].recordId
}
