import type { Request, Response } from 'express'

import {
  type GetUserPermissionsReturn,
  getUserPermissions
} from '../../database/getUserPermissions.js'

export interface DoGetUserPermissionsResponse {
  userPermissions: GetUserPermissionsReturn
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const userPermissions = await getUserPermissions(
    request.body.userName as string
  )

  const responseJson: DoGetUserPermissionsResponse = {
    userPermissions
  }

  response.json(responseJson)
}

export default handler
