import type { Request, Response } from 'express'

import { getUnusedEmployeeUserNames } from '../../database/getUnusedEmployeeUserNames.js'
import { getUsers } from '../../database/getUsers.js'
import { getConfigProperty } from '../../helpers/functions.config.js'
import { availablePermissionValues } from '../../helpers/functions.permissions.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const users = await getUsers()
  const tempUsers = getConfigProperty('tempUsers')

  const unusedEmployeeUserNames = await getUnusedEmployeeUserNames()

  response.render('admin.users.ejs', {
    headTitle: 'User Maintenance',
    users,
    tempUsers,
    unusedEmployeeUserNames,
    availablePermissionValues
  })
}

export default handler
