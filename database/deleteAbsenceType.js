import * as sqlPool from '@cityssm/mssql-multi-pool';
import * as configFunctions from '../helpers/functions.config.js';
export async function deleteAbsenceType(absenceTypeKey, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('absenceTypeKey', absenceTypeKey)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date()).query(`update MonTY.AbsenceTypes
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where absenceTypeKey = @absenceTypeKey
      and recordDelete_dateTime is null`);
    return result.rowsAffected[0] > 0;
}
