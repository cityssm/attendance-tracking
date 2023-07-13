/* eslint-disable @typescript-eslint/indent */

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type { CallOutResponseType } from '../types/recordTypes.js'

import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

export async function getCallOutResponseTypes(): Promise<
  CallOutResponseType[]
> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const responseTypeResult: IResult<CallOutResponseType> = await pool.request()
    .query(`select
      responseTypeId, responseType, isSuccessful, orderNumber
      from MonTY.CallOutResponseTypes
      where recordDelete_dateTime is null
      order by orderNumber, responseType`)

  const responseTypes = responseTypeResult.recordset

  let expectedOrderNumber = -1

  for (const responseType of responseTypes) {
    expectedOrderNumber += 1

    if (responseType.orderNumber !== expectedOrderNumber) {
      await updateRecordOrderNumber(
        'CallOutResponseTypes',
        responseType.responseTypeId,
        expectedOrderNumber
      )
    }
  }

  return responseTypes
}
