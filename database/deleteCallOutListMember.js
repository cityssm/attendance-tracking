import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function deleteCallOutListMember(listId, employeeNumber, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('listId', listId)
        .input('employeeNumber', employeeNumber)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date()).query(`update MonTY.CallOutListMembers
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where listId = @listId
      and employeeNumber = @employeeNumber
      and recordDelete_dateTime is null`);
    return result.rowsAffected[0];
}