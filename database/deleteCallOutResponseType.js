import * as sqlPool from '@cityssm/mssql-multi-pool';
import { clearCacheByTableName } from '../helpers/functions.cache.js';
import * as configFunctions from '../helpers/functions.config.js';
export async function deleteCallOutResponseType(responseTypeId, sessionUser) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('responseTypeId', responseTypeId)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date())
        .query(`update MonTY.CallOutResponseTypes
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where responseTypeId = @responseTypeId
      and recordDelete_dateTime is null`);
    clearCacheByTableName('CallOutResponseTypes');
    return result.rowsAffected[0] > 0;
}
