import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'

interface AddAbsenceRecordForm {
  employeeNumber: string
  employeeName: string
  absenceDateString: string
  absenceTypeKey: string
  returnDateString: string
  recordComment: string
}

export async function addAbsenceRecord(
  form: AddAbsenceRecordForm,
  sessionUser: MonTYUser
): Promise<string> {
  const pool = await sqlPool.connect(getConfigProperty('mssql'))

  const result: IResult<{ recordId: string }> = await pool
    .request()
    .input('employeeNumber', form.employeeNumber)
    .input('employeeName', form.employeeName)
    .input('absenceDateTime', form.absenceDateString)
    .input('absenceTypeKey', form.absenceTypeKey)
    .input(
      'returnDateTime',
      form.returnDateString === '' ? undefined : form.returnDateString
    )
    .input('recordComment', form.recordComment)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .query(`insert into MonTY.AbsenceRecords
      (employeeNumber, employeeName, absenceDateTime, absenceTypeKey, returnDateTime, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@employeeNumber, @employeeName, @absenceDateTime, @absenceTypeKey, @returnDateTime, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  return result.recordset[0].recordId
}
