import type { Request, Response } from 'express'

import { deleteAfterHoursReason } from '../../database/deleteAfterHoursReason.js'
import { getAfterHoursReasons } from '../../database/getAfterHoursReasons.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteAfterHoursReason(
    request.body.afterHoursReasonId,
    request.session
  )

  const afterHoursReasons = await getAfterHoursReasons()

  response.json({
    success,
    afterHoursReasons
  })
}

export default handler
