import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'

export async function clearUserPermissions(userName: string): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  await pool.request().input('userName', userName)
    .query(`delete from MonTY.UserPermissions
      where userName = @userName`)

  return true
}
