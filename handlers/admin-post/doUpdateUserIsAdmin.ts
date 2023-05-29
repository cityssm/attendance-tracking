import type { Request, Response } from 'express'

import { getUsers } from '../../database/getUsers.js'
import { updateUserIsAdmin } from '../../database/updateUserIsAdmin.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateUserIsAdmin(
    request.body.userName,
    request.body.isAdmin,
    request.session
  )

  const users = await getUsers()

  response.json({
    success,
    users
  })
}

export default handler
