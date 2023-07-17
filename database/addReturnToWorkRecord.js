import * as sqlPool from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function addReturnToWorkRecord(form, sessionUser) {
    const pool = await sqlPool.connect(getConfigProperty('mssql'));
    const result = await pool
        .request()
        .input('employeeNumber', form.employeeNumber)
        .input('employeeName', form.employeeName)
        .input('returnDateTime', form.returnDateString === '' ? undefined : form.returnDateString)
        .input('returnShift', form.returnShift)
        .input('recordComment', form.recordComment)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date())
        .query(`insert into MonTY.ReturnToWorkRecords
      (employeeNumber, employeeName, returnDateTime, returnShift, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@employeeNumber, @employeeName, @returnDateTime, @returnShift, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`);
    return result.recordset[0].recordId;
}
