import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes.js'
import type { IResult } from 'mssql'

interface AddReturnToWorkRecordForm {
  employeeNumber: string
  employeeName: string
  returnDateString: string
  returnShift: string
  recordComment: string
}

export async function addReturnToWorkRecord(
  form: AddReturnToWorkRecordForm,
  requestSession: recordTypes.PartialSession
): Promise<string> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result: IResult<{ recordId: string }> = await pool
    .request()
    .input('employeeNumber', form.employeeNumber)
    .input('employeeName', form.employeeName)
    .input('returnDateTime', form.returnDateString === '' ? undefined : form.returnDateString)
    .input('returnShift', form.returnShift)
    .input('recordComment', form.recordComment)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date())
    .query(`insert into MonTY.ReturnToWorkRecords
      (employeeNumber, employeeName, returnDateTime, returnShift, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@employeeNumber, @employeeName, @returnDateTime, @returnShift, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  return result.recordset[0].recordId
}
