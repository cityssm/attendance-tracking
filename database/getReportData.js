import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
const callOutRecordsRecentSQL = `select r.recordId,
  r.listId, l.listName,
  r.employeeNumber, e.employeeSurname, e.employeeGivenName,
  r.callOutDateTime, r.callOutHours,
  t.responseType, t.isSuccessful,
  r.recordComment,
  r.recordUpdate_userName, r.recordUpdate_dateTime
  from MonTY.CallOutRecords r
  left join MonTY.CallOutLists l on r.listId = l.listId
  left join MonTY.Employees e on r.employeeNumber = e.employeeNumber
  left join MonTY.CallOutResponseTypes t on r.responseTypeId = t.responseTypeId
  where r.recordDelete_datetime is null
  and datediff(day, r.callOutDateTime, getdate()) <= @recentDays`;
export async function getReportData(reportName, reportParameters = {}) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    let request = pool.request();
    let sql;
    switch (reportName) {
        case 'employees-all': {
            sql = 'select * from MonTY.Employees';
            break;
        }
        case 'callOutListMembers-formatted': {
            sql = `select m.listId, l.listName,
        m.employeeNumber, e.employeeSurname, e.employeeGivenName,
        e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
        m.sortKey
        from MonTY.CallOutListMembers m
        left join MonTY.CallOutLists l on m.listId = l.listId
        left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
        where m.recordDelete_datetime is null
        order by m.listId, m.sortKey, m.employeeNumber`;
            break;
        }
        case 'callOutListMembers-formatted-byListId': {
            sql = `select m.listId, l.listName,
        m.employeeNumber, e.employeeSurname, e.employeeGivenName,
        e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
        m.sortKey
        from MonTY.CallOutListMembers m
        left join MonTY.CallOutLists l on m.listId = l.listId
        left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
        where m.recordDelete_datetime is null
        and m.listId = @listId
        order by m.listId, m.sortKey, m.employeeNumber`;
            request = request.input('listId', reportParameters.listId);
            break;
        }
        case 'callOutRecords-recent': {
            sql = callOutRecordsRecentSQL;
            request = request.input('recentDays', configFunctions.getProperty('settings.recentDays'));
            break;
        }
        case 'callOutRecords-recent-byListId': {
            sql = callOutRecordsRecentSQL + ' and r.listId = @listId';
            request = request
                .input('recentDays', configFunctions.getProperty('settings.recentDays'))
                .input('listId', reportParameters.listId);
            break;
        }
        case 'callOutRecords-recent-byEmployeeNumber': {
            sql = callOutRecordsRecentSQL + ' and r.employeeNumber = @employeeNumber';
            request = request
                .input('recentDays', configFunctions.getProperty('settings.recentDays'))
                .input('employeeNumber', reportParameters.employeeNumber);
            break;
        }
        default: {
            return undefined;
        }
    }
    const result = await request.query(sql);
    return result.recordset;
}
export default getReportData;
