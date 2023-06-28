import type { Request, Response } from 'express'

import { addUser } from '../../database/addUser.js'
import { getUsers } from '../../database/getUsers.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addUser(request.body.userName, request.session.user!)

  const users = await getUsers()

  response.json({
    success,
    users
  })
}

export default handler
