import * as sqlPool from '@cityssm/mssql-multi-pool'

import * as configFunctions from '../helpers/functions.config.js'
import type * as recordTypes from '../types/recordTypes'

export async function setUserPermission(
  userPermission: {
    userName: string
    permissionKey: string
    permissionValue: string
  },
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

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
