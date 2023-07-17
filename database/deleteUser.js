import * as sqlPool from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function deleteUser(userName, sessionUser) {
    const pool = await sqlPool.connect(getConfigProperty('mssql'));
    const result = await pool
        .request()
        .input('userName', userName)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date()).query(`update MonTY.Users
      set recordDelete_userName = @record_userName,
      recordDelete_dateTime = @record_dateTime
      where userName = @userName
      and recordDelete_dateTime is null`);
    return result.rowsAffected[0] > 0;
}
