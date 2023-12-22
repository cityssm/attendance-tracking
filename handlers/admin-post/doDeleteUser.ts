import type { Request, Response } from 'express'

import { deleteUser } from '../../database/deleteUser.js'
import { getUsers } from '../../database/getUsers.js'

export interface DoDeleteUserResponse {
  success: boolean
  users: AttendUser[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteUser(
    request.body.userName as string,
    request.session.user as AttendUser
  )

  const users = await getUsers()

  const responseJson: DoDeleteUserResponse = {
    success,
    users
  }

  response.json(responseJson)
}

export default handler
