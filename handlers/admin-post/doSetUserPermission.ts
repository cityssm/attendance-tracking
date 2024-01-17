import type { Request, Response } from 'express'

import { getUsers } from '../../database/getUsers.js'
import {
  type SetUserPermissionForm,
  setUserPermission
} from '../../database/setUserPermission.js'

export interface DoSetUserPermissionResponse {
  success: boolean
  users: AttendUser[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await setUserPermission(request.body as SetUserPermissionForm)

  const users = await getUsers()

  const responseJson: DoSetUserPermissionResponse = {
    success,
    users
  }

  response.json(responseJson)
}

export default handler
