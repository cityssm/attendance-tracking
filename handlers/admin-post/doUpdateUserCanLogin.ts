import type { Request, Response } from 'express'

import { getUsers } from '../../database/getUsers.js'
import { updateUserCanLogin } from '../../database/updateUserCanLogin.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateUserCanLogin(
    request.body.userName,
    request.body.canLogin,
    request.session.user as MonTYUser
  )

  const users = await getUsers()

  response.json({
    success,
    users
  })
}

export default handler
