import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getReturnToWorkRecords(filters) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    let sql = `select r.recordId,
    r.employeeNumber, r.employeeName,
    r.returnDateTime, r.returnShift,
    r.recordComment,
    r.recordCreate_userName, r.recordCreate_dateTime
    from MonTY.ReturnToWorkRecords r
    where r.recordDelete_dateTime is null`;
    let request = pool.request();
    if ((filters.employeeNumber ?? '') !== '') {
        sql += ' and r.employeeNumber = @employeeNumber';
        request = request.input('employeeNumber', filters.employeeNumber);
    }
    if (filters.recentOnly) {
        sql += ' and datediff(day, r.returnDateTime, getdate()) <= @recentDays';
        request = request.input('recentDays', configFunctions.getProperty('settings.recentDays'));
    }
    sql += ' order by r.returnDateTime desc, r.recordId desc';
    const recordsResult = await request.query(sql);
    return recordsResult.recordset;
}
