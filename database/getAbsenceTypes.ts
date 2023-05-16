import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

import type { AbsenceType } from '../types/recordTypes'

export async function getAbsenceTypes(): Promise<AbsenceType[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const absenceTypeResult: IResult<AbsenceType> = await pool.request()
    .query(`select
      absenceTypeKey, absenceType, orderNumber
      from MonTY.AbsenceTypes
      where recordDelete_dateTime is null
      order by orderNumber, absenceType`)

  const absenceTypes = absenceTypeResult.recordset

  let expectedOrderNumber = -1

  for (const absenceType of absenceTypes) {
    expectedOrderNumber += 1

    if (absenceType.orderNumber !== expectedOrderNumber) {
      await updateRecordOrderNumber(
        'AbsenceTypes',
        absenceType.absenceTypeKey,
        expectedOrderNumber
      )
    }
  }

  return absenceTypes
}
