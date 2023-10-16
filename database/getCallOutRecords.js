import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function getCallOutRecords(filters) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    let sql = `select r.recordId, r.listId, r.employeeNumber,
    r.callOutDateTime, r.callOutHours,
    r.responseTypeId, t.responseType, t.isSuccessful,
    coalesce(r.recordComment, '') as recordComment,
    r.recordCreate_userName, r.recordCreate_dateTime
    from MonTY.CallOutRecords r
    left join MonTY.CallOutResponseTypes t on r.responseTypeId = t.responseTypeId
    where r.recordDelete_dateTime is null`;
    let request = pool.request();
    if ((filters.listId ?? '') !== '') {
        sql += ' and r.listId = @listId';
        request = request.input('listId', filters.listId);
    }
    if ((filters.employeeNumber ?? '') !== '') {
        sql += ' and r.employeeNumber = @employeeNumber';
        request = request.input('employeeNumber', filters.employeeNumber);
    }
    if (filters.recentOnly) {
        sql += ' and datediff(day, r.callOutDateTime, getdate()) <= @recentDays';
        request = request.input('recentDays', getConfigProperty('settings.recentDays'));
    }
    sql += ' order by r.callOutDateTime desc, r.recordId desc';
    const recordsResult = await request.query(sql);
    return recordsResult.recordset;
}
