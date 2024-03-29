import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'

export interface SetUserPermissionForm {
  userName: string
  permissionKey: string
  permissionValue: string
}

export async function setUserPermission(
  userPermission: SetUserPermissionForm
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  let result = await pool
    .request()
    .input('userName', userPermission.userName)
    .input('permissionKey', userPermission.permissionKey)
    .query(`delete from MonTY.UserPermissions
      where userName = @userName
      and permissionKey = @permissionKey`)

  if (userPermission.permissionValue !== '') {
    result = await pool
      .request()
      .input('userName', userPermission.userName)
      .input('permissionKey', userPermission.permissionKey)
      .input('permissionValue', userPermission.permissionValue)
      .query(`insert into MonTY.UserPermissions
        (userName, permissionKey, permissionValue)
        values (@userName, @permissionKey, @permissionValue)`)
  }

  return userPermission.permissionValue === '' || result.rowsAffected[0] > 0
}
