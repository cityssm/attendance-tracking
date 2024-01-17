import type { Request, Response } from 'express'

import {
  clearUserPermissions
} from '../../database/clearUserPermissions.js'
import { getUsers } from '../../database/getUsers.js'

export interface DoClearUserPermissionsResponse {
  success: boolean
  users: AttendUser[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await clearUserPermissions(request.body.userName as string)

  const users = await getUsers()

  const responseJson: DoClearUserPermissionsResponse = {
    success,
    users
  }

  response.json(responseJson)
}

export default handler
