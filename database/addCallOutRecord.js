import * as sqlPool from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function addCallOutRecord(form, sessionUser) {
    const pool = await sqlPool.connect(getConfigProperty('mssql'));
    let callOutDateTimeString = '';
    if (form.callOutDateString !== undefined &&
        (form.callOutDateString ?? '') !== '') {
        callOutDateTimeString = (form.callOutDateString +
            ' ' +
            (form.callOutTimeString ?? '')).trim();
    }
    const result = await pool
        .request()
        .input('listId', form.listId)
        .input('employeeNumber', form.employeeNumber)
        .input('callOutDateTime', callOutDateTimeString === '' ? new Date() : callOutDateTimeString)
        .input('callOutHours', form.callOutHours)
        .input('responseTypeId', form.responseTypeId)
        .input('recordComment', form.recordComment)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date())
        .query(`insert into MonTY.CallOutRecords
      (listId, employeeNumber, callOutDateTime, callOutHours, responseTypeId, recordComment,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.recordId
      values (@listId, @employeeNumber, @callOutDateTime, @callOutHours, @responseTypeId, @recordComment,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`);
    return result.recordset[0].recordId;
}
