import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import * as permissionFunctions from '../helpers/functions.permissions.js'
import type {
  PartialSession,
  ReturnToWorkRecord
} from '../types/recordTypes'

interface GetReturnToWorkRecordsFilters {
  recordId?: string
  employeeNumber?: string
  recentOnly: boolean
  todayOnly: boolean
}

export async function getReturnToWorkRecords(
  filters: GetReturnToWorkRecordsFilters,
  requestSession: PartialSession
): Promise<ReturnToWorkRecord[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let sql = `select r.recordId,
    r.employeeNumber, r.employeeName,
    r.returnDateTime, r.returnShift,
    r.recordComment,
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
      configFunctions.getProperty('settings.recentDays')
    )
  }

  sql += ' order by r.returnDateTime desc, r.recordId desc'

  const recordsResult: IResult<ReturnToWorkRecord> = await request.query(sql)

  const returnToWorkRecords = recordsResult.recordset

  if (
    permissionFunctions.hasPermission(
      requestSession.user!,
      'attendance.returnsToWork.canUpdate'
    )
  ) {
    for (const returnToWorkRecord of returnToWorkRecords) {
      returnToWorkRecord.canUpdate =
        permissionFunctions.hasPermission(
          requestSession.user!,
          'attendance.returnsToWork.canManage'
        ) ||
        (returnToWorkRecord.recordCreate_userName ===
          requestSession.user?.userName &&
          Date.now() - returnToWorkRecord.recordCreate_dateTime!.getTime() <=
            configFunctions.getProperty('settings.updateDays') * 86_400 * 1000)
    }
  }

  return returnToWorkRecords
}
