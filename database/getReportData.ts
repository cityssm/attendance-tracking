/* eslint-disable no-case-declarations */

import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

export type ReportParameters = Record<string, string | number>

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
  and datediff(day, r.callOutDateTime, getdate()) <= @recentDays`

export async function getReportData(
  reportName: string,
  reportParameters: ReportParameters = {}
): Promise<unknown[] | undefined> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let request = pool.request()

  let sql: string

  switch (reportName) {
    case 'employees-all': {
      sql = 'select * from MonTY.Employees'
      break
    }

    /*
     * Call Out List Members
     */

    case 'callOutListMembers-formatted': {
      sql = `select m.listId, l.listName,
        m.employeeNumber, e.employeeSurname, e.employeeGivenName,
        e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
        m.sortKey
        from MonTY.CallOutListMembers m
        left join MonTY.CallOutLists l on m.listId = l.listId
        left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
        where m.recordDelete_datetime is null
        order by m.listId, m.sortKey, m.employeeNumber`

      break
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
        order by m.listId, m.sortKey, m.employeeNumber`

      request = request.input('listId', reportParameters.listId)

      break
    }

    /*
     * Call Out Records
     */

    case 'callOutRecords-recent': {
      sql = callOutRecordsRecentSQL + ' order by r.callOutDateTime, r.recordId'

      request = request.input(
        'recentDays',
        configFunctions.getProperty('settings.recentDays')
      )

      break
    }

    case 'callOutRecords-recent-byListId': {
      sql =
        callOutRecordsRecentSQL +
        ` and r.listId = @listId
          order by r.callOutDateTime, r.recordId`

      request = request
        .input('recentDays', configFunctions.getProperty('settings.recentDays'))
        .input('listId', reportParameters.listId)

      break
    }

    case 'callOutRecords-recent-byEmployeeNumber': {
      sql = callOutRecordsRecentSQL + ' and r.employeeNumber = @employeeNumber'

      request = request
        .input('recentDays', configFunctions.getProperty('settings.recentDays'))
        .input('employeeNumber', reportParameters.employeeNumber)

      break
    }

    default: {
      return undefined
    }
  }

  const result = await request.query(sql)

  return result.recordset
}

export default getReportData
