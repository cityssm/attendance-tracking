import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { CallOutResponseType } from '../types/recordTypes'

export async function getCallOutResponseTypes(
): Promise<CallOutResponseType[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const responseTypeResult: IResult<CallOutResponseType> = await pool
    .request()
    .query(`select
      responseTypeId, responseType, isSuccessful, orderNumber
      from MonTY.CallOutResponseTypes
      where recordDelete_dateTime is null
      order by orderNumber, responseType`)

  return responseTypeResult.recordset
}
