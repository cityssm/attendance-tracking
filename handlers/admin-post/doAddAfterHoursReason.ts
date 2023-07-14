import type { Request, Response } from 'express'

import { addAfterHoursReason } from '../../database/addAfterHoursReason.js'
import { getAfterHoursReasons } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const afterHoursReasonId = await addAfterHoursReason(request.body, request.session.user as MonTYUser)

  const afterHoursReasons = await getAfterHoursReasons()

  response.json({
    success: true,
    afterHoursReasonId,
    afterHoursReasons
  })
}

export default handler
