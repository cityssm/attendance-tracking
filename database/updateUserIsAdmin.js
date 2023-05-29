import * as sqlPool from '@cityssm/mssql-multi-pool';
import * as configFunctions from '../helpers/functions.config.js';
export async function updateUserIsAdmin(userName, isAdmin, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('isAdmin', isAdmin)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date())
        .input('userName', userName).query(`update MonTY.Users
      set isAdmin = @isAdmin,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      where userName = @userName
        and recordDelete_dateTime is null`);
    return result.rowsAffected[0] > 0;
}
