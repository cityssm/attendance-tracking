import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { AbsenceRecord } from '../types/recordTypes'

interface GetAbsenceRecordsFilters {
  employeeNumber?: string
  recentOnly: boolean
}

export async function getAbsenceRecords(
  filters: GetAbsenceRecordsFilters
): Promise<AbsenceRecord[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let sql = `select r.recordId,
    r.employeeNumber, r.employeeName,
    r.absenceDateTime,
    r.absenceTypeKey, t.absenceType,
    r.recordComment,
    r.recordCreate_userName
    from MonTY.AbsenceRecords r
    left join MonTY.AbsenceTypes t on r.absenceTypeKey = t.absenceTypeKey
    where r.recordDelete_dateTime is null`

  let request = pool.request()

  if ((filters.employeeNumber ?? '') !== '') {
    sql += ' and r.employeeNumber = @employeeNumber'
    request = request.input('employeeNumber', filters.employeeNumber)
  }

  if (filters.recentOnly) {
    sql += ' and datediff(day, r.absenceDateTime, getdate()) <= @recentDays'
    request = request.input(
      'recentDays',
      configFunctions.getProperty('settings.recentDays')
    )
  }

  sql += ' order by r.absenceDateTime desc, r.recordId desc'

  const recordsResult: IResult<AbsenceRecord> = await request.query(sql)

  return recordsResult.recordset
}
