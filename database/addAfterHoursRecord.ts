import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type * as recordTypes from '../types/recordTypes'

interface AddAfterHoursRecordForm {
  employeeNumber: string
  employeeName: string
  attendanceDateString?: string
  attendanceTimeString?: string
  afterHoursReasonId: string
  recordComment: string
}

export async function addAfterHoursRecord(
  form: AddAfterHoursRecordForm,
  sessionUser: recordTypes.User
): Promise<string> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let attendanceDateTimeString = ''

  if ((form.attendanceDateString ?? '') !== '') {
    attendanceDateTimeString = (
      form.attendanceDateString! +
      ' ' +
      (form.attendanceTimeString ?? '')
    ).trim()
  }

  const result: IResult<{ recordId: string }> = await pool
    .request()
    .input('employeeNumber', form.employeeNumber)
    .input('employeeName', form.employeeName)
    .input(
      'attendanceDateTime',
      attendanceDateTimeString === '' ? new Date() : attendanceDateTimeString
    )
    .input('afterHoursReasonId', form.afterHoursReasonId)
    .input('recordComment', form.recordComment)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .query(`insert into MonTY.AfterHoursRecords
      (employeeNumber, employeeName, attendanceDateTime, afterHoursReasonId, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@employeeNumber, @employeeName, @attendanceDateTime, @afterHoursReasonId, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  return result.recordset[0].recordId
}
