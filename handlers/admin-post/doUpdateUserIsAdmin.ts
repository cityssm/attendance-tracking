import type { Request, Response } from 'express'

import { getUsers } from '../../database/getUsers.js'
import { updateUserIsAdmin } from '../../database/updateUser.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateUserIsAdmin(
    request.body.userName as string,
    request.body.isAdmin as '0' | '1',
    request.session.user as AttendUser
  )

  const users = await getUsers()

  response.json({
    success,
    users
  })
}

export default handler
