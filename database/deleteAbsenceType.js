import * as sqlPool from '@cityssm/mssql-multi-pool';
import { clearCacheByTableName } from '../helpers/functions.cache.js';
import * as configFunctions from '../helpers/functions.config.js';
export async function deleteAbsenceType(absenceTypeKey, sessionUser) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('absenceTypeKey', absenceTypeKey)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date()).query(`update MonTY.AbsenceTypes
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where absenceTypeKey = @absenceTypeKey
      and recordDelete_dateTime is null`);
    clearCacheByTableName('AbsenceTypes');
    return result.rowsAffected[0] > 0;
}
