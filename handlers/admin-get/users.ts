import type { Request, Response } from 'express'

import { getUsers } from '../../database/getUsers.js'
import { availablePermissionValues } from '../../helpers/functions.permissions.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const users = await getUsers()

  response.render('admin.users.ejs', {
    headTitle: 'User Maintenance',
    users,
    availablePermissionValues
  })
}

export default handler
