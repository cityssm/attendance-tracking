import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'

export async function getRecentReturnShiftValues(): Promise<string[]> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result: IResult<{ returnShift: string }> = await pool
    .request()
    .input('recentDays', getConfigProperty('settings.recentDays'))
    .query(`select returnShift
      from MonTY.ReturnToWorkRecords r
      where r.recordDelete_dateTime is null
      and r.returnShift <> ''
      and datediff(day, r.returnDateTime, getdate()) <= @recentDays
      group by r.returnShift
      having count(r.returnShift) >= 3
      order by count(r.returnShift) desc`)

  const returnShifts: string[] = []

  for (const record of result.recordset) {
    returnShifts.push(record.returnShift)
  }

  return returnShifts
}
