import { getConfigProperty } from './functions.config.js';
const recentDays = getConfigProperty('settings.recentDays');
const absenceRecordsRecentSQL = `select r.recordId,
  r.employeeNumber, r.employeeName,
  r.absenceDateTime, r.returnDateTime,
  t.absenceType,
  r.recordComment,
  r.recordUpdate_userName, r.recordUpdate_dateTime
  from MonTY.AbsenceRecords r
  left join MonTY.AbsenceTypes t on r.absenceTypeKey = t.absenceTypeKey
  where r.recordDelete_datetime is null
  and datediff(day, r.absenceDateTime, getdate()) <= @recentDays`;
const returnToWorkRecordsRecentSQL = `select r.recordId,
  r.employeeNumber, r.employeeName,
  r.returnDateTime, r.returnShift,
  r.recordComment,
  r.recordUpdate_userName, r.recordUpdate_dateTime
  from MonTY.ReturnToWorkRecords r
  where r.recordDelete_datetime is null
  and datediff(day, r.returnDateTime, getdate()) <= @recentDays`;
const callOutRecordsRecentSQL = `select r.recordId,
  r.listId, l.listName,
  r.employeeNumber, e.employeeSurname, e.employeeGivenName,
  r.callOutDateTime, r.callOutHours, r.natureOfCallOut,
  t.responseType, t.isSuccessful,
  r.recordComment,
  r.recordUpdate_userName, r.recordUpdate_dateTime
  from MonTY.CallOutRecords r
  left join MonTY.CallOutLists l on r.listId = l.listId
  left join MonTY.Employees e on r.employeeNumber = e.employeeNumber
  left join MonTY.CallOutResponseTypes t on r.responseTypeId = t.responseTypeId
  where r.recordDelete_datetime is null
  and datediff(day, r.callOutDateTime, getdate()) <= @recentDays`;
const afterHoursRecordsRecentSQL = `select r.recordId,
  r.employeeNumber, r.employeeName,
  r.attendanceDateTime,
  t.afterHoursReason,
  r.recordComment,
  r.recordUpdate_userName, r.recordUpdate_dateTime
  from MonTY.AfterHoursRecords r
  left join MonTY.AfterHoursReasons t on r.afterHoursReasonId = t.afterHoursReasonId
  where r.recordDelete_datetime is null
  and datediff(day, r.attendanceDateTime, getdate()) <= @recentDays`;
const reports = new Map();
reports.set('employees-all', {
    sql: 'select * from MonTY.Employees',
    permissions: ['reports.hasRawExports', 'attendance.callOuts.canView']
});
reports.set('employees-contacts', {
    sql: `select
    employeeNumber, employeeSurname, employeeGivenName,
    jobTitle, department,
    workContact1, workContact2, homeContact1, homeContact2
    from MonTY.Employees
    where isActive = 1
    and recordDelete_dateTime is null
    order by employeeSurname, employeeGivenName, employeeNumber`,
    permissions: ['attendance.callOuts.canView']
});
reports.set('employees-inactive', {
    sql: `select
    employeeNumber, employeeSurname, employeeGivenName,
    jobTitle, department
    from MonTY.Employees
    where isActive = 0
    and recordDelete_dateTime is null
    order by employeeSurname, employeeGivenName, employeeNumber`,
    permissions: ['attendance.callOuts.canView']
});
reports.set('absenceRecords-all', {
    sql: 'select * from MonTY.AbsenceRecords',
    permissions: ['reports.hasRawExports', 'attendance.absences.canView']
});
reports.set('absenceRecords-recent', {
    sql: `${absenceRecordsRecentSQL}
    order by r.absenceDateTime, r.recordId`,
    permissions: ['attendance.absences.canView'],
    inputs() {
        return {
            recentDays
        };
    }
});
reports.set('absenceRecords-recent-byEmployeeNumber', {
    sql: `${absenceRecordsRecentSQL}
    and r.employeeNumber = @employeeNumber
    order by r.absenceDateTime, r.recordId`,
    permissions: ['attendance.absences.canView'],
    inputs(reportParameters = {}) {
        return {
            recentDays,
            employeeNumber: reportParameters.employeeNumber
        };
    }
});
reports.set('historicalAbsenceRecords-all', {
    sql: 'select * from MonTY.HistoricalAbsenceRecords',
    permissions: ['reports.hasRawExports', 'attendance.absences.canView']
});
reports.set('absenceTypes-all', {
    sql: 'select * from MonTY.AbsenceTypes',
    permissions: ['reports.hasRawExports', 'attendance.absences.canView']
});
reports.set('absenceTypes-active', {
    sql: `select absenceTypeKey, absenceType, orderNumber,
    recordUpdate_userName, recordUpdate_dateTime
    from MonTY.AbsenceTypes
    where recordDelete_dateTime is null
    order by orderNumber, absenceType`,
    permissions: ['attendance.absences.canView']
});
reports.set('returnToWorkRecords-all', {
    sql: 'select * from MonTY.ReturnToWorkRecords',
    permissions: ['reports.hasRawExports', 'attendance.returnsToWork.canView']
});
reports.set('returnToWorkRecords-recent', {
    sql: `${returnToWorkRecordsRecentSQL}
    order by r.returnDateTime, r.recordId`,
    permissions: ['attendance.returnsToWork.canView'],
    inputs() {
        return {
            recentDays
        };
    }
});
reports.set('returnToWorkRecords-recent-byEmployeeNumber', {
    sql: `${returnToWorkRecordsRecentSQL}
    and r.employeeNumber = @employeeNumber
    order by r.returnDateTime, r.recordId`,
    permissions: ['attendance.returnsToWork.canView'],
    inputs(reportParameters = {}) {
        return {
            recentDays,
            employeeNumber: reportParameters.employeeNumber
        };
    }
});
reports.set('historicalReturnToWorkRecords-all', {
    sql: 'select * from MonTY.HistoricalReturnToWorkRecords',
    permissions: ['reports.hasRawExports', 'attendance.returnsToWork.canView']
});
reports.set('callOutListMembers-formatted', {
    sql: `select m.listId, l.listName,
    m.employeeNumber, e.employeeSurname, e.employeeGivenName,
    e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
    m.sortKey
    from MonTY.CallOutListMembers m
    left join MonTY.CallOutLists l on m.listId = l.listId
    left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
    where m.recordDelete_datetime is null
    order by m.listId, m.sortKey, m.employeeNumber`,
    permissions: ['attendance.callOuts.canView']
});
reports.set('callOutListMembers-formatted-byListId', {
    sql: `select m.listId, l.listName,
    m.employeeNumber, e.employeeSurname, e.employeeGivenName,
    e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
    m.sortKey
    from MonTY.CallOutListMembers m
    left join MonTY.CallOutLists l on m.listId = l.listId
    left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
    where m.recordDelete_datetime is null
    and m.listId = @listId
    order by m.listId, m.sortKey, m.employeeNumber`,
    permissions: ['attendance.callOuts.canView'],
    inputs(reportParameters = {}) {
        return {
            listId: reportParameters.listId
        };
    }
});
reports.set('callOutRecords-all', {
    sql: 'select * from MonTY.CallOutRecords',
    permissions: ['reports.hasRawExports', 'attendance.callOuts.canView']
});
reports.set('callOutRecords-recent', {
    sql: `${callOutRecordsRecentSQL}
    order by r.callOutDateTime, r.recordId`,
    permissions: ['attendance.callOuts.canView'],
    inputs() {
        return {
            recentDays
        };
    }
});
reports.set('callOutRecords-recent-byListId', {
    sql: `${callOutRecordsRecentSQL}
    and r.listId = @listId
    order by r.callOutDateTime, r.recordId`,
    permissions: ['attendance.callOuts.canView'],
    inputs(reportParameters = {}) {
        return {
            recentDays,
            listId: reportParameters.listId
        };
    }
});
reports.set('callOutRecords-recent-byEmployeeNumber', {
    sql: `${callOutRecordsRecentSQL}
    and r.employeeNumber = @employeeNumber
    order by r.callOutDateTime, r.recordId`,
    permissions: ['attendance.callOuts.canView'],
    inputs(reportParameters) {
        return {
            recentDays,
            employeeNumber: reportParameters.employeeNumber
        };
    }
});
reports.set('historicalCallOutRecords-all', {
    sql: 'select * from MonTY.HistoricalCallOutRecords',
    permissions: ['reports.hasRawExports', 'attendance.callOuts.canView']
});
reports.set('callOutResponseTypes-all', {
    sql: 'select * from MonTY.CallOutResponseTypes',
    permissions: ['reports.hasRawExports', 'attendance.callOuts.canView']
});
reports.set('callOutResponseTypes-active', {
    sql: `select responseTypeId, responseType, isSuccessful, orderNumber,
    recordUpdate_userName, recordUpdate_dateTime
    from MonTY.CallOutResponseTypes
    where recordDelete_dateTime is null
    order by orderNumber, responseType`,
    permissions: ['attendance.callOuts.canView']
});
reports.set('afterHoursRecords-all', {
    sql: 'select * from MonTY.AfterHoursRecords',
    permissions: ['reports.hasRawExports', 'attendance.afterHours.canView']
});
reports.set('afterHoursRecords-recent', {
    sql: `${afterHoursRecordsRecentSQL} order by r.attendanceDateTime, r.recordId`,
    permissions: ['attendance.afterHours.canView'],
    inputs() {
        return {
            recentDays
        };
    }
});
reports.set('afterHoursRecords-recent-byEmployeeNumber', {
    sql: `${afterHoursRecordsRecentSQL}
    and r.employeeNumber = @employeeNumber
    order by r.attendanceDateTime, r.recordId`,
    permissions: ['attendance.afterHours.canView'],
    inputs(reportParameters = {}) {
        return {
            recentDays,
            employeeNumber: reportParameters.employeeNumber
        };
    }
});
reports.set('historicalAfterHoursRecords-all', {
    sql: 'select * from MonTY.HistoricalAfterHoursRecords',
    permissions: ['reports.hasRawExports', 'attendance.afterHours.canView']
});
reports.set('afterHoursReasons-all', {
    sql: 'select * from MonTY.AfterHoursReasons',
    permissions: ['reports.hasRawExports', 'attendance.afterHours.canView']
});
reports.set('afterHoursReasons-active', {
    sql: `select afterHoursReasonId, afterHoursReason, orderNumber,
    recordUpdate_userName, recordUpdate_dateTime
    from MonTY.AfterHoursReasons
    where recordDelete_dateTime is null
    order by orderNumber, afterHoursReason`,
    permissions: ['attendance.afterHours.canView']
});
export function getReportDefinition(reportName) {
    return reports.get(reportName);
}
