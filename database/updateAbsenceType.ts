import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import { getConfigProperty } from '../helpers/functions.config.js'
import type { AbsenceType } from '../types/recordTypes.js'

export async function updateAbsenceType(
  absenceType: AbsenceType,
  sessionUser: MonTYUser
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const result = await pool
    .request()
    .input('absenceType', absenceType.absenceType)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .input('absenceTypeKey', absenceType.absenceTypeKey)
    .query(`update MonTY.AbsenceTypes
      set absenceType = @absenceType,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      where absenceTypeKey = @absenceTypeKey
        and recordDelete_dateTime is null`)

  clearCacheByTableName('AbsenceTypes')

  return result.rowsAffected[0] > 0
}
