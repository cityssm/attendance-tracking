import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty, historicalDays } from '../helpers/functions.config.js';
const absenceRecordsColumnNames = `recordId, employeeNumber, employeeName,
  absenceDateTime, absenceTypeKey, returnDateTime, recordComment,
  recordCreate_userName, recordCreate_dateTime,
  recordUpdate_userName, recordUpdate_dateTime,
  recordDelete_userName, recordDelete_dateTime`;
const returnToWorkRecordsColumnNames = `recordId, employeeNumber, employeeName,
  returnDateTime, returnShift, recordComment,
  recordCreate_userName, recordCreate_dateTime,
  recordUpdate_userName, recordUpdate_dateTime,
  recordDelete_userName, recordDelete_dateTime`;
const callOutRecordsColumnNames = `recordId, listId, employeeNumber,
  callOutDateTime, callOutHours, natureOfCallOut, responseTypeId, recordComment,
  recordCreate_userName, recordCreate_dateTime,
  recordUpdate_userName, recordUpdate_dateTime,
  recordDelete_userName, recordDelete_dateTime`;
const afterHoursRecordsColumnNames = `recordId, employeeNumber, employeeName,
  attendanceDateTime, afterHoursReasonId, recordComment,
  recordCreate_userName, recordCreate_dateTime,
  recordUpdate_userName, recordUpdate_dateTime,
  recordDelete_userName, recordDelete_dateTime`;
export async function moveRecordsToHistorical() {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    let rowsAffected = 0;
    let result = await pool.request().input('historicalDays', historicalDays)
        .query(`insert into MonTY.HistoricalAbsenceRecords (${absenceRecordsColumnNames})
      select ${absenceRecordsColumnNames}
      from MonTY.AbsenceRecords
      where datediff(day, recordUpdate_dateTime, getdate()) > @historicalDays
        and datediff(day, absenceDateTime, getdate()) > @historicalDays
        and (returnDateTime is null or datediff(day, returnDateTime, getdate()) > @historicalDays)`);
    if (result.rowsAffected[0] > 0) {
        rowsAffected += result.rowsAffected[0];
        await pool.request().query(`delete from MonTY.AbsenceRecords
        where recordId in (select recordId from MonTY.HistoricalAbsenceRecords)`);
    }
    result = await pool.request().input('historicalDays', historicalDays)
        .query(`insert into MonTY.HistoricalReturnToWorkRecords (${returnToWorkRecordsColumnNames})
      select ${returnToWorkRecordsColumnNames}
      from MonTY.ReturnToWorkRecords
      where datediff(day, recordUpdate_dateTime, getdate()) > @historicalDays
        and datediff(day, returnDateTime, getdate()) > @historicalDays`);
    if (result.rowsAffected[0] > 0) {
        rowsAffected += result.rowsAffected[0];
        await pool.request().query(`delete from MonTY.ReturnToWorkRecords
        where recordId in (select recordId from MonTY.HistoricalReturnToWorkRecords)`);
    }
    result = await pool.request().input('historicalDays', historicalDays)
        .query(`insert into MonTY.HistoricalCallOutRecords (${callOutRecordsColumnNames})
      select ${callOutRecordsColumnNames}
      from MonTY.CallOutRecords
      where datediff(day, recordUpdate_dateTime, getdate()) > @historicalDays
        and datediff(day, callOutDateTime, getdate()) > @historicalDays`);
    if (result.rowsAffected[0] > 0) {
        rowsAffected += result.rowsAffected[0];
        await pool.request().query(`delete from MonTY.CallOutRecords
        where recordId in (select recordId from MonTY.HistoricalCallOutRecords)`);
    }
    result = await pool.request().input('historicalDays', historicalDays)
        .query(`insert into MonTY.HistoricalAfterHoursRecords (${afterHoursRecordsColumnNames})
      select ${afterHoursRecordsColumnNames}
      from MonTY.AfterHoursRecords
      where datediff(day, recordUpdate_dateTime, getdate()) > @historicalDays
        and datediff(day, attendanceDateTime, getdate()) > @historicalDays`);
    if (result.rowsAffected[0] > 0) {
        rowsAffected += result.rowsAffected[0];
        await pool.request().query(`delete from MonTY.AfterHoursRecords
        where recordId in (select recordId from MonTY.HistoricalAfterHoursRecords)`);
    }
    return rowsAffected;
}
