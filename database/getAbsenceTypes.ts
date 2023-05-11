import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { AbsenceType } from '../types/recordTypes'

export async function getAbsenceTypes(
): Promise<AbsenceType[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const responseTypeResult: IResult<AbsenceType> = await pool
    .request()
    .query(`select
      absenceTypeKey, absenceType, orderNumber
      from MonTY.AbsenceTypes
      where recordDelete_dateTime is null
      order by orderNumber, absenceType`)

  return responseTypeResult.recordset
}
