import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
import { hasPermission } from '../helpers/functions.permissions.js';
export async function getAfterHoursRecords(filters, sessionUser) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    let sql = `select r.recordId,
    r.employeeNumber, r.employeeName,
    r.attendanceDateTime,
    r.afterHoursReasonId, t.afterHoursReason,
    r.recordComment,
    r.recordCreate_userName, r.recordCreate_dateTime,
    0 as canUpdate
    from MonTY.AfterHoursRecords r
    left join MonTY.AfterHoursReasons t on r.afterHoursReasonId = t.afterHoursReasonId
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
        sql += ' and datediff(day, r.attendanceDateTime, getdate()) < 1';
    }
    else if (filters.recentOnly) {
        sql += ' and datediff(day, r.attendanceDateTime, getdate()) <= @recentDays';
        request = request.input('recentDays', getConfigProperty('settings.recentDays'));
    }
    sql += ' order by r.attendanceDateTime desc, r.recordId desc';
    const recordsResult = await request.query(sql);
    const afterHoursRecords = recordsResult.recordset;
    if (hasPermission(sessionUser, 'attendance.afterHours.canUpdate')) {
        for (const afterHoursRecord of afterHoursRecords) {
            afterHoursRecord.canUpdate =
                hasPermission(sessionUser, 'attendance.afterHours.canManage') ||
                    (afterHoursRecord.recordCreate_userName === sessionUser.userName &&
                        Date.now() -
                            afterHoursRecord.recordCreate_dateTime.getTime() <=
                            getConfigProperty('settings.updateDays') * 86_400 * 1000);
        }
    }
    return afterHoursRecords;
}
