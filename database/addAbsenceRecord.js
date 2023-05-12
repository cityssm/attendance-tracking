import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function addAbsenceRecord(form, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('employeeNumber', form.employeeNumber)
        .input('employeeName', form.employeeName)
        .input('absenceDateTime', form.absenceDateString)
        .input('absenceTypeKey', form.absenceTypeKey)
        .input('returnDateTime', form.returnDateString === '' ? undefined : form.returnDateString)
        .input('recordComment', form.recordComment)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date())
        .query(`insert into MonTY.AbsenceRecords
      (employeeNumber, employeeName, absenceDateTime, absenceTypeKey, returnDateTime, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@employeeNumber, @employeeName, @absenceDateTime, @absenceTypeKey, @returnDateTime, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`);
    return result.recordset[0].recordId;
}
