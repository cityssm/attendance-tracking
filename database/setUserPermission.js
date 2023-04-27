import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function setUserPermission(userPermission, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    await pool
        .request()
        .input('userName', userPermission.userName)
        .input('permissionKey', userPermission.permissionKey)
        .query(`delete from MonTY.UserPermissions
      where userName = @userName
      and permissionKey = @permissionKey`);
    const result = await pool
        .request()
        .input('userName', userPermission.userName)
        .input('permissionKey', userPermission.permissionKey)
        .input('permissionValue', userPermission.permissionValue)
        .query(`insert into MonTY.UserPermissions
      (userName, permissionKey, permissionValue)
      values (@userName, @permissionKey, @permissionValue)`);
    return result.rowsAffected[0] > 0;
}
