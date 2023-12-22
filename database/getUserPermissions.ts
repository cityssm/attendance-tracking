// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'
import type { availablePermissionValues } from '../helpers/functions.permissions.js'

export type GetUserPermissionsReturn = Partial<
  Record<keyof typeof availablePermissionValues, string>
>

export async function getUserPermissions(
  userName: string
): Promise<GetUserPermissionsReturn> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const permissionsResult: IResult<{
    permissionKey: string
    permissionValue: string
  }> = await pool.request().input('userName', userName).query(`select
      permissionKey, permissionValue
      from MonTY.UserPermissions
      where userName = @userName`)

  const permissions: GetUserPermissionsReturn = {}

  for (const permission of permissionsResult.recordset) {
    permissions[permission.permissionKey] = permission.permissionValue
  }

  return permissions
}
