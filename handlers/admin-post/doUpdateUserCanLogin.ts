import type { Request, Response } from 'express'

import { getUsers } from '../../database/getUsers.js'
import { updateUserCanLogin } from '../../database/updateUser.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateUserCanLogin(
    request.body.userName as string,
    request.body.canLogin as '0' | '1',
    request.session.user as AttendUser
  )

  const users = await getUsers()

  response.json({
    success,
    users
  })
}

export default handler
