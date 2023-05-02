import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getCallOutResponseTypes() {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const responseTypeResult = await pool
        .request()
        .query(`select
      responseTypeId, responseType, isSuccessful, orderNumber
      from MonTY.CallOutResponseTypes
      where recordDelete_dateTime is null
      order by orderNumber, responseType`);
    return responseTypeResult.recordset;
}
