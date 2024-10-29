import crypto from 'node:crypto';
import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import camelCase from 'camelcase';
import { clearCacheByTableName } from '../helpers/functions.cache.js';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function addAbsenceType(form, sessionUser) {
    let absenceTypeKey = await getAvailableAbsenceTypeKey(form.absenceType);
    while (absenceTypeKey === '') {
        absenceTypeKey = await getAvailableAbsenceTypeKey(crypto.randomUUID());
    }
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    await pool
        .request()
        .input('absenceTypeKey', absenceTypeKey)
        .input('absenceType', form.absenceType)
        .input('orderNumber', -1)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date()).query(`insert into MonTY.AbsenceTypes
      (absenceTypeKey, absenceType, orderNumber,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      values (@absenceTypeKey, @absenceType, @orderNumber,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`);
    clearCacheByTableName('AbsenceTypes');
    return absenceTypeKey;
}
async function getAvailableAbsenceTypeKey(absenceType) {
    const absenceTypeKeyRoot = camelCase(absenceType).slice(0, 10);
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    for (let index = 0; index <= 9_999_999_999; index += 1) {
        const indexString = index.toString();
        const absenceTypeKey = index === 0
            ? absenceTypeKeyRoot
            : absenceTypeKeyRoot.slice(0, 10 - indexString.length) + indexString;
        const result = await pool.request().input('absenceTypeKey', absenceTypeKey)
            .query(`select absenceTypeKey
        from MonTY.AbsenceTypes
        where absenceTypeKey = @absenceTypeKey`);
        if (result.recordset.length === 0) {
            return absenceTypeKey;
        }
    }
    return '';
}
