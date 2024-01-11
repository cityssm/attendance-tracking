import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
async function updateUserField(userName, userField, fieldValue, sessionUser) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    const result = await pool
        .request()
        .input('fieldValue', fieldValue)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date())
        .input('userName', userName).query(`update MonTY.Users
      set ${userField} = @fieldValue,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      where userName = @userName
        and recordDelete_dateTime is null`);
    return result.rowsAffected[0] > 0;
}
export async function updateUserCanLogin(userName, canLogin, sessionUser) {
    return await updateUserField(userName, 'canLogin', canLogin, sessionUser);
}
export async function updateUserIsAdmin(userName, isAdmin, sessionUser) {
    return await updateUserField(userName, 'isAdmin', isAdmin, sessionUser);
}
