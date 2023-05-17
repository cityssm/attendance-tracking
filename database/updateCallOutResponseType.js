import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function updateCallOutResponseType(callOutResponseType, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('responseType', callOutResponseType.responseType)
        .input('isSuccessful', callOutResponseType.isSuccessful)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date())
        .input('responseTypeId', callOutResponseType.responseTypeId)
        .query(`update MonTY.CallOutResponseTypes
      set responseType = @responseType,
      isSuccessful = @isSuccessful,
      recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime
      where responseTypeId = @responseTypeId
      and recordDelete_dateTime is null`);
    return result.rowsAffected[0] > 0;
}
