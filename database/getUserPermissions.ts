/* eslint-disable @typescript-eslint/indent */

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type { availablePermissionValues } from '../helpers/functions.permissions.js'

export async function getUserPermissions(
  userName: string
): Promise<Partial<Record<keyof typeof availablePermissionValues, string>>> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const permissionsResult: IResult<{
    permissionKey: string
    permissionValue: string
  }> = await pool.request().input('userName', userName).query(`select
      permissionKey, permissionValue
      from MonTY.UserPermissions
      where userName = @userName`)

  const permissions: Partial<
    Record<keyof typeof availablePermissionValues, string>
  > = {}

  for (const permission of permissionsResult.recordset) {
    permissions[permission.permissionKey] = permission.permissionValue
  }

  return permissions
}
