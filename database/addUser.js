import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function addUser(userName, sessionUser) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    let result = await pool
        .request()
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date())
        .input('userName', userName)
        .query(`update MonTY.Users
      set recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime,
      recordDelete_userName = null,
      recordDelete_dateTime = null
      where userName = @userName`);
    if (result.rowsAffected[0] === 0) {
        result = await pool
            .request()
            .input('userName', userName)
            .input('canLogin', 0)
            .input('isAdmin', 0)
            .input('record_userName', sessionUser.userName)
            .input('record_dateTime', new Date())
            .query(`insert into MonTY.Users
        (userName, canLogin, isAdmin,
          recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
        values (@userName, @canLogin, @isAdmin,
          @record_userName, @record_dateTime, @record_userName, @record_dateTime)`);
    }
    return result.rowsAffected[0] > 0;
}
