import type { Request, Response } from 'express'

import { updateAfterHoursReason } from '../../database/updateAfterHoursReason.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateAfterHoursReason(request.body, request.session.user as MonTYUser)

  response.json({
    success
  })
}

export default handler
