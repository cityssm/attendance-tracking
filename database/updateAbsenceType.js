import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function updateAbsenceType(absenceType, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('absenceType', absenceType.absenceType)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date())
        .input('absenceTypeKey', absenceType.absenceTypeKey)
        .query(`update MonTY.AbsenceTypes
      set absenceType = @absenceType,
      recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime
      where absenceTypeKey = @absenceTypeKey
      and recordDelete_dateTime is null`);
    return result.rowsAffected[0] > 0;
}