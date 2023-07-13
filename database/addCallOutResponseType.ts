import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { clearCacheByTableName } from '../helpers/functions.cache.js'
import * as configFunctions from '../helpers/functions.config.js'

interface AddCallOutResponseTypeForm {
  responseType: string
  isSuccessful: '0' | '1'
}

export async function addCallOutResponseType(
  form: AddCallOutResponseTypeForm,
  sessionUser: MonTYUser
): Promise<string> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const result: IResult<{ responseTypeId: string }> = await pool
    .request()
    .input('responseType', form.responseType)
    .input('isSuccessful', form.isSuccessful)
    .input('orderNumber', -1)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .query(`insert into MonTY.CallOutResponseTypes
      (responseType, isSuccessful, orderNumber,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.responseTypeId
      values (@responseType, @isSuccessful, @orderNumber,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  clearCacheByTableName('CallOutResponseTypes')

  return result.recordset[0].responseTypeId
}
