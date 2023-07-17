import * as sqlPool from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function getUserPermissions(userName) {
    const pool = await sqlPool.connect(getConfigProperty('mssql'));
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
