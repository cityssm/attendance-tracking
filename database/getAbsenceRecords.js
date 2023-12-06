import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
import { hasPermission } from '../helpers/functions.permissions.js';
import { getCallOutLists } from './getCallOutLists.js';
export async function getAbsenceRecords(filters, options, sessionUser) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    let sql = `select r.recordId,
    r.employeeNumber, r.employeeName,
    r.absenceDateTime, r.returnDateTime,
    r.absenceTypeKey, t.absenceType,
    coalesce(r.recordComment, '') as recordComment,
    r.recordCreate_userName, r.recordCreate_dateTime,
    0 as canUpdate
    from MonTY.AbsenceRecords r
    left join MonTY.AbsenceTypes t on r.absenceTypeKey = t.absenceTypeKey
    where r.recordDelete_dateTime is null`;
    let request = pool.request();
    if ((filters.recordId ?? '') !== '') {
        sql += ' and r.recordId = @recordId';
        request = request.input('recordId', filters.recordId);
    }
    if ((filters.employeeNumber ?? '') !== '') {
        sql += ' and r.employeeNumber = @employeeNumber';
        request = request.input('employeeNumber', filters.employeeNumber);
    }
    if (filters.todayOnly) {
        sql += ' and datediff(hour, r.absenceDateTime, getdate()) < 24';
    }
    else if (filters.recentOnly) {
        sql += ' and datediff(day, r.absenceDateTime, getdate()) <= @recentDays';
        request = request.input('recentDays', getConfigProperty('settings.recentDays'));
    }
    sql += ' order by r.absenceDateTime desc, r.recordId desc';
    const recordsResult = await request.query(sql);
    const absenceRecords = recordsResult.recordset;
    for (const absenceRecord of absenceRecords) {
        absenceRecord.canUpdate =
            hasPermission(sessionUser, 'attendance.absences.canManage') ||
                (hasPermission(sessionUser, 'attendance.absences.canUpdate') &&
                    absenceRecord.recordCreate_userName === sessionUser.userName &&
                    Date.now() - absenceRecord.recordCreate_dateTime.getTime() <=
                        getConfigProperty('settings.updateDays') * 86400 * 1000);
        if (options.includeCallOutListIds ?? false) {
            absenceRecord.callOutLists = await getCallOutLists({
                employeeNumber: absenceRecord.employeeNumber,
                favouriteOnly: false
            }, sessionUser);
        }
    }
    return absenceRecords;
}
