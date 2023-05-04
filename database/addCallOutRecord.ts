import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes'
import type { IResult } from 'mssql'

interface AddCallOutRecordForm {
  listId: string
  employeeNumber: string
  callOutDateString?: string
  callOutTimeString?: string
  callOutHours: string
  responseTypeId: string
  recordComment: string
}

export async function addCallOutRecord(
  form: AddCallOutRecordForm,
  requestSession: recordTypes.PartialSession
): Promise<string> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let callOutDateTimeString = ''

  if ((form.callOutDateString ?? '') !== '') {
    callOutDateTimeString = (
      form.callOutDateString! +
      ' ' +
      (form.callOutTimeString ?? '')
    ).trim()
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
    .input('responseTypeId', form.responseTypeId)
    .input('recordComment', form.recordComment)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date())
    .query(`insert into MonTY.CallOutRecords
      (listId, employeeNumber, callOutDateTime, callOutHours, responseTypeId, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@listId, @employeeNumber, @callOutDateTime, @callOutHours, @responseTypeId, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  return result.recordset[0].recordId
}