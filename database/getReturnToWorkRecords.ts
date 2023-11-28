import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'
import { hasPermission } from '../helpers/functions.permissions.js'
import type { ReturnToWorkRecord } from '../types/recordTypes.js'

interface GetReturnToWorkRecordsFilters {
  recordId?: string
  employeeNumber?: string
  recentOnly: boolean
  todayOnly: boolean
}

export async function getReturnToWorkRecords(
  filters: GetReturnToWorkRecordsFilters,
  sessionUser: AttendUser
): Promise<ReturnToWorkRecord[]> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  let sql = `select r.recordId,
    r.employeeNumber, r.employeeName,
    r.returnDateTime, r.returnShift,
    coalesce(r.recordComment, '') as recordComment,
    r.recordCreate_userName, r.recordCreate_dateTime
    from MonTY.ReturnToWorkRecords r
    where r.recordDelete_dateTime is null`

  let request = pool.request()

  if ((filters.recordId ?? '') !== '') {
    sql += ' and r.recordId = @recordId'
    request = request.input('recordId', filters.recordId)
  }

  if ((filters.employeeNumber ?? '') !== '') {
    sql += ' and r.employeeNumber = @employeeNumber'
    request = request.input('employeeNumber', filters.employeeNumber)
  }

  if (filters.todayOnly) {
    sql += ' and datediff(day, r.returnDateTime, getdate()) < 1'
  } else if (filters.recentOnly) {
    sql += ' and datediff(day, r.returnDateTime, getdate()) <= @recentDays'
    request = request.input(
      'recentDays',
      getConfigProperty('settings.recentDays')
    )
  }

  sql += ' order by r.returnDateTime desc, r.recordId desc'

  const recordsResult: IResult<ReturnToWorkRecord> = await request.query(sql)

  const returnToWorkRecords = recordsResult.recordset

  if (hasPermission(sessionUser, 'attendance.returnsToWork.canUpdate')) {
    for (const returnToWorkRecord of returnToWorkRecords) {
      returnToWorkRecord.canUpdate =
        hasPermission(sessionUser, 'attendance.returnsToWork.canManage') ||
        (returnToWorkRecord.recordCreate_userName === sessionUser.userName &&
          Date.now() -
            (returnToWorkRecord.recordCreate_dateTime as Date).getTime() <=
            getConfigProperty('settings.updateDays') * 86_400 * 1000)
    }
  }

  return returnToWorkRecords
}
