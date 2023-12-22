import type { Request, Response } from 'express'

import { getUsers } from '../../database/getUsers.js'
import {
  updateUserCanLogin,
  updateUserIsAdmin
} from '../../database/updateUser.js'

export interface DoUpdateUserResponse {
  success: boolean
  users: AttendUser[]
}

export async function doUpdateUserCanLoginHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateUserCanLogin(
    request.body.userName as string,
    request.body.canLogin as '0' | '1',
    request.session.user as AttendUser
  )

  const users = await getUsers()

  const responseJson: DoUpdateUserResponse = {
    success,
    users
  }

  response.json(responseJson)
}

export async function doUpdateUserIsAdminHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateUserIsAdmin(
    request.body.userName as string,
    request.body.isAdmin as '0' | '1',
    request.session.user as AttendUser
  )

  const users = await getUsers()

  const responseJson: DoUpdateUserResponse = {
    success,
    users
  }

  response.json(responseJson)
}
