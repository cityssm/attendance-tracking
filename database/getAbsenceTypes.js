import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getAbsenceTypes() {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const responseTypeResult = await pool
        .request()
        .query(`select
      absenceTypeKey, absenceType, orderNumber
      from MonTY.AbsenceTypes
      where recordDelete_dateTime is null
      order by orderNumber, absenceType`);
    return responseTypeResult.recordset;
}
