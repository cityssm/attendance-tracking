import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getUserPermissions(userName) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const permissionsResult = await pool.request().input('userName', userName).query(`select
      permissionKey, permissionValue
      from MonTY.UserPermissions
      where userName = @userName`);
    const permissions = {};
    for (const permission of permissionsResult.recordset) {
        permissions[permission.permissionKey] = permission.permissionValue;
    }
    return permissions;
}
