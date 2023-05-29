import * as sqlPool from '@cityssm/mssql-multi-pool';
import * as configFunctions from '../helpers/functions.config.js';
export async function addAfterHoursRecord(form, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    let attendanceDateTimeString = '';
    if ((form.attendanceDateString ?? '') !== '') {
        attendanceDateTimeString = (form.attendanceDateString +
            ' ' +
            (form.attendanceTimeString ?? '')).trim();
    }
    const result = await pool
        .request()
        .input('employeeNumber', form.employeeNumber)
        .input('employeeName', form.employeeName)
        .input('attendanceDateTime', attendanceDateTimeString === '' ? new Date() : attendanceDateTimeString)
        .input('afterHoursReasonId', form.afterHoursReasonId)
        .input('recordComment', form.recordComment)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date())
        .query(`insert into MonTY.AfterHoursRecords
      (employeeNumber, employeeName, attendanceDateTime, afterHoursReasonId, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@employeeNumber, @employeeName, @attendanceDateTime, @afterHoursReasonId, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`);
    return result.recordset[0].recordId;
}
