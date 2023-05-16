import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
const recordIdColumns = new Map();
recordIdColumns.set('AbsenceTypes', 'absenceTypeKey');
recordIdColumns.set('CallOutResponseTypes', 'responseTypeId');
async function getCurrentOrderNumber(recordTable, recordId) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('recordId', recordId)
        .query(`select orderNumber
        from MonTY.${recordTable}
        where ${recordIdColumns.get(recordTable)} = @recordId`);
    return result.recordset[0].orderNumber;
}
export async function moveRecordDown(recordTable, recordId) {
    const currentOrderNumber = await getCurrentOrderNumber(recordTable, recordId);
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    await pool
        .request()
        .input('currentOrderNumber', currentOrderNumber)
        .query(`update MonTY.${recordTable}
        set orderNumber = orderNumber - 1
        where recordDelete_dateTime is null
        and orderNumber = @currentOrderNumber + 1`);
    const success = await updateRecordOrderNumber(recordTable, recordId, currentOrderNumber + 1);
    return success;
}
export async function moveRecordDownToBottom(recordTable, recordId) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const currentOrderNumber = await getCurrentOrderNumber(recordTable, recordId);
    const maxOrderNumberResult = await pool
        .request()
        .query(`select max(orderNumber) as maxOrderNumber
        from MonTY.${recordTable}
        where recordDelete_dateTime is null`);
    const maxOrderNumber = maxOrderNumberResult.recordset[0].maxOrderNumber;
    if (currentOrderNumber !== maxOrderNumber) {
        await updateRecordOrderNumber(recordTable, recordId, maxOrderNumber + 1);
        await pool
            .request()
            .input('currentOrderNumber', currentOrderNumber)
            .query(`update MonTY.${recordTable}
          set orderNumber = orderNumber - 1
          where recordDelete_dateTime is null
          and orderNumber > @currentOrderNumber`);
    }
    return true;
}
export async function moveRecordUp(recordTable, recordId) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const currentOrderNumber = await getCurrentOrderNumber(recordTable, recordId);
    if (currentOrderNumber <= 0) {
        return true;
    }
    await pool
        .request()
        .input('currentOrderNumber', currentOrderNumber)
        .query(`update MonTY.${recordTable}
        set orderNumber = orderNumber + 1
        where recordDelete_dateTime is null
        and orderNumber = @currentOrderNumber - 1`);
    const success = await updateRecordOrderNumber(recordTable, recordId, currentOrderNumber - 1);
    return success;
}
export async function moveRecordUpToTop(recordTable, recordId) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const currentOrderNumber = await getCurrentOrderNumber(recordTable, recordId);
    if (currentOrderNumber > 0) {
        await updateRecordOrderNumber(recordTable, recordId, -1);
        await pool
            .request()
            .input('currentOrderNumber', currentOrderNumber)
            .query(`update MonTY.${recordTable}
          set orderNumber = orderNumber + 1
          where recordDelete_dateTime is null
          and orderNumber < @currentOrderNumber`);
    }
    return true;
}
