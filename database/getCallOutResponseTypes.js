import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export async function getCallOutResponseTypes() {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const responseTypeResult = await pool.request()
        .query(`select
      responseTypeId, responseType, isSuccessful, orderNumber
      from MonTY.CallOutResponseTypes
      where recordDelete_dateTime is null
      order by orderNumber, responseType`);
    const responseTypes = responseTypeResult.recordset;
    let expectedOrderNumber = -1;
    for (const responseType of responseTypes) {
        expectedOrderNumber += 1;
        if (responseType.orderNumber !== expectedOrderNumber) {
            await updateRecordOrderNumber('CallOutResponseTypes', responseType.responseTypeId, expectedOrderNumber);
        }
    }
    return responseTypes;
}
