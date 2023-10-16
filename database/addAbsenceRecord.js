import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function addAbsenceRecord(form, sessionUser) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const result = await pool
        .request()
        .input('employeeNumber', form.employeeNumber)
        .input('employeeName', form.employeeName)
        .input('absenceDateTime', form.absenceDateString)
        .input('absenceTypeKey', form.absenceTypeKey)
        .input('returnDateTime', form.returnDateString === '' ? undefined : form.returnDateString)
        .input('recordComment', form.recordComment)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date())
        .query(`insert into MonTY.AbsenceRecords
      (employeeNumber, employeeName, absenceDateTime, absenceTypeKey, returnDateTime, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@employeeNumber, @employeeName, @absenceDateTime, @absenceTypeKey, @returnDateTime, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`);
    return result.recordset[0].recordId;
}
