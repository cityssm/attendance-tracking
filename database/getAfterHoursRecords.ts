import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { AfterHoursRecord } from '../types/recordTypes.js'

interface GetAfterHoursRecordsFilters {
  employeeNumber?: string
  recentOnly: boolean
  todayOnly: boolean
}

export async function getAfterHoursRecords(
  filters: GetAfterHoursRecordsFilters
): Promise<AfterHoursRecord[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let sql = `select r.recordId,
    r.employeeNumber, r.employeeName,
    r.attendanceDateTime,
    r.afterHoursReasonId, t.afterHoursReason,
    r.recordComment,
    r.recordCreate_userName, r.recordCreate_dateTime
    from MonTY.AfterHoursRecords r
    left join MonTY.AfterHoursReasons t on r.afterHoursReasonId = t.afterHoursReasonId
    where r.recordDelete_dateTime is null`

  let request = pool.request()

  if ((filters.employeeNumber ?? '') !== '') {
    sql += ' and r.employeeNumber = @employeeNumber'
    request = request.input('employeeNumber', filters.employeeNumber)
  }

  if (filters.todayOnly) {
    sql += ' and datediff(day, r.attendanceDateTime, getdate()) < 1'
  } else if (filters.recentOnly) {
    sql += ' and datediff(day, r.attendanceDateTime, getdate()) <= @recentDays'
    request = request.input(
      'recentDays',
      configFunctions.getProperty('settings.recentDays')
    )
  }

  sql += ' order by r.attendanceDateTime desc, r.recordId desc'

  const recordsResult: IResult<AfterHoursRecord> = await request.query(sql)

  return recordsResult.recordset
}
