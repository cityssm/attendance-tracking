import type { Request, Response } from 'express'

import { addUser } from '../../database/addUser.js'
import { deleteUser } from '../../database/deleteUser.js'
import { getUsers } from '../../database/getUsers.js'
import {
  updateUserCanLogin,
  updateUserIsAdmin
} from '../../database/updateUser.js'

export interface DoModifyUserResponse {
  success: boolean
  users: AttendUser[]
}

export async function doAddUserHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addUser(
    request.body.userName as string,
    request.session.user as AttendUser
  )

  const users = await getUsers()

  const responseJson: DoModifyUserResponse = {
    success,
    users
  }

  response.json(responseJson)
}

export async function doDeleteUserHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteUser(
    request.body.userName as string,
    request.session.user as AttendUser
  )

  const users = await getUsers()

  const responseJson: DoModifyUserResponse = {
    success,
    users
  }

  response.json(responseJson)
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

  const responseJson: DoModifyUserResponse = {
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

  const responseJson: DoModifyUserResponse = {
    success,
    users
  }

  response.json(responseJson)
}
