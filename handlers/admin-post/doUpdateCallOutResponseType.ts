import type { Request, Response } from 'express'

import { updateCallOutResponseType } from '../../database/updateCallOutResponseType.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateCallOutResponseType(request.body, request.session)

  response.json({
    success
  })
}

export default handler
