import type { Request, Response } from 'express'

import {
  type SetUserPermissionForm,
  setUserPermission
} from '../../database/setUserPermission.js'

export interface DoSetUserPermissionResponse {
  success: boolean
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await setUserPermission(request.body as SetUserPermissionForm)

  const responseJson: DoSetUserPermissionResponse = {
    success
  }

  response.json(responseJson)
}

export default handler
