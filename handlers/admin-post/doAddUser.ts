import type { Request, Response } from 'express'

import { addUser } from '../../database/addUser.js'
import { getUsers } from '../../database/getUsers.js'

export interface DoAddUserResponse {
  success: boolean
  users: AttendUser[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addUser(
    request.body.userName as string,
    request.session.user as AttendUser
  )

  const users = await getUsers()

  const responseJson: DoAddUserResponse = {
    success,
    users
  }

  response.json(responseJson)
}

export default handler
