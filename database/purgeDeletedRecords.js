import * as sqlPool from '@cityssm/mssql-multi-pool';
import * as configFunctions from '../helpers/functions.config.js';
const historicalRecordTables = [
    'HistoricalAbsenceRecords',
    'HistoricalAfterHoursRecords',
    'HistoricalCallOutRecords',
    'HistoricalReturnToWorkRecords'
];
const deletedWhereClause = ' datediff(day, recordDelete_dateTime, getdate()) > @deleteDays';
const foreignKeySQLStatements = [
    `delete from MonTY.AbsenceTypes
    where ${deletedWhereClause}
    and absenceTypeKey not in (select absenceTypeKey from MonTY.AbsenceRecords)
    and absenceTypeKey not in (select absenceTypeKey from MonTY.HistoricalAbsenceRecords)`,
    `delete from MonTY.AfterHoursReasons
    where ${deletedWhereClause}
    and afterHoursReasonId not in (select afterHoursReasonId from MonTY.AfterHoursRecords)
    and afterHoursReasonId not in (select afterHoursReasonId from MonTY.HistoricalAfterHoursRecords)`,
    `delete from MonTY.FavouriteCallOutLists
    where userName in (select userName from MonTY.Users where ${deletedWhereClause})
    or listId in (select listId from MonTY.CallOutLists where ${deletedWhereClause})`,
    `delete from MonTY.CallOutResponseTypes
    where ${deletedWhereClause}
    and responseTypeId not in (select responseTypeId from MonTY.CallOutRecords)
    and responseTypeId not in (select responseTypeId from MonTY.HistoricalCallOutRecords)`,
    `delete from MonTY.CallOutListMembers
    where ${deletedWhereClause}
    or listId in (select listId from MonTY.CallOutLists where ${deletedWhereClause})`,
    `delete from MonTY.CallOutLists
    where ${deletedWhereClause}
    and listId not in (select listId from MonTY.FavouriteCallOutLists)
    and listId not in (select listId from MonTY.CallOutListMembers)
    and listId not in (select listId from MonTY.CallOutRecords)
    and listId not in (select listId from MonTY.HistoricalCallOutRecords)`,
    `delete from MonTY.EmployeeProperties
    where ${deletedWhereClause}
    or employeeNumber in (select employeeNumber from MonTY.Employees where ${deletedWhereClause})`,
    `delete from MonTY.Employees
    where ${deletedWhereClause}
    and employeeNumber not in (select employeeNumber from MonTY.AbsenceRecords)
    and employeeNumber not in (select employeeNumber from MonTY.HistoricalAbsenceRecords)
    and employeeNumber not in (select employeeNumber from MonTY.AfterHoursRecords)
    and employeeNumber not in (select employeeNumber from MonTY.HistoricalAfterHoursRecords)
    and employeeNumber not in (select employeeNumber from MonTY.CallOutRecords)
    and employeeNumber not in (select employeeNumber from MonTY.HistoricalCallOutRecords)
    and employeeNumber not in (select employeeNumber from MonTY.HistoricalReturnToWorkRecords)
    and employeeNumber not in (select employeeNumber from MonTY.ReturnToWorkRecords)
    and employeeNumber not in (select employeeNumber from MonTY.EmployeeProperties)
    and userName not in (select userName from MonTY.Users)`,
    `delete from MonTY.UserPermissions
    where userName in (select userName from MonTY.Users where ${deletedWhereClause})`,
    `delete from MonTY.Users
    where ${deletedWhereClause}
    and userName not in (select userName from MonTY.UserPermissions)
    and userName not in (select userName from MonTY.Employees)`
];
export async function purgeDeletedRecords() {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    let rowsAffected = 0;
    for (const historicalRecordTable of historicalRecordTables) {
        const result = await pool
            .request()
            .input('deleteDays', configFunctions.deleteDays)
            .query(`delete from MonTY.${historicalRecordTable}
        where ${deletedWhereClause}`);
        rowsAffected += result.rowsAffected[0];
    }
    for (const sql of foreignKeySQLStatements) {
        const result = await pool
            .request()
            .input('deleteDays', configFunctions.deleteDays)
            .query(sql);
        rowsAffected += result.rowsAffected[0];
    }
    return rowsAffected;
}
