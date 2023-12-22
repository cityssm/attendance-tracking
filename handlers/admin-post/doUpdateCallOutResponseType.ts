import type { Request, Response } from 'express'

import { updateCallOutResponseType } from '../../database/updateCallOutResponseType.js'
import type { CallOutResponseType } from '../../types/recordTypes.js'

export interface DoUpdateCallOutResponseTypeResponse {
  success: boolean
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateCallOutResponseType(
    request.body as CallOutResponseType,
    request.session.user as AttendUser
  )

  const responseJson: DoUpdateCallOutResponseTypeResponse = {
    success
  }

  response.json(responseJson)
}

export default handler
