import * as sqlPool from '@cityssm/mssql-multi-pool';
import * as configFunctions from '../helpers/functions.config.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export async function getAbsenceTypes() {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const absenceTypeResult = await pool.request()
        .query(`select
      absenceTypeKey, absenceType, orderNumber
      from MonTY.AbsenceTypes
      where recordDelete_dateTime is null
      order by orderNumber, absenceType`);
    const absenceTypes = absenceTypeResult.recordset;
    let expectedOrderNumber = -1;
    for (const absenceType of absenceTypes) {
        expectedOrderNumber += 1;
        if (absenceType.orderNumber !== expectedOrderNumber) {
            await updateRecordOrderNumber('AbsenceTypes', absenceType.absenceTypeKey, expectedOrderNumber);
        }
    }
    return absenceTypes;
}
