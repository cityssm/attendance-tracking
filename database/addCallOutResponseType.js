import * as sqlPool from '@cityssm/mssql-multi-pool';
import { clearCacheByTableName } from '../helpers/functions.cache.js';
import * as configFunctions from '../helpers/functions.config.js';
export async function addCallOutResponseType(form, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('responseType', form.responseType)
        .input('isSuccessful', form.isSuccessful)
        .input('orderNumber', -1)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date())
        .query(`insert into MonTY.CallOutResponseTypes
      (responseType, isSuccessful, orderNumber,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      output inserted.responseTypeId
      values (@responseType, @isSuccessful, @orderNumber,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`);
    clearCacheByTableName('CallOutResponseTypes');
    return result.recordset[0].responseTypeId;
}
