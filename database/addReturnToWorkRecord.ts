import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'

interface AddReturnToWorkRecordForm {
  employeeNumber: string
  employeeName: string
  returnDateString: string
  returnShift: string
  recordComment: string
}

export async function addReturnToWorkRecord(
  form: AddReturnToWorkRecordForm,
  sessionUser: AttendUser
): Promise<string> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result: IResult<{ recordId: string }> = await pool
    .request()
    .input('employeeNumber', form.employeeNumber)
    .input('employeeName', form.employeeName)
    .input(
      'returnDateTime',
      form.returnDateString === '' ? undefined : form.returnDateString
    )
    .input('returnShift', form.returnShift)
    .input('recordComment', form.recordComment)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .query(`insert into MonTY.ReturnToWorkRecords
      (employeeNumber, employeeName, returnDateTime, returnShift, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@employeeNumber, @employeeName, @returnDateTime, @returnShift, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  return result.recordset[0].recordId
}
