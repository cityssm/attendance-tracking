import type { Request, Response } from 'express'

import { addAfterHoursReason } from '../../database/addAfterHoursReason.js'
import { getAfterHoursReasons } from '../../database/getAfterHoursReasons.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const afterHoursReasonId = await addAfterHoursReason(request.body, request.session)

  const afterHoursReasons = await getAfterHoursReasons()

  response.json({
    success: true,
    afterHoursReasonId,
    afterHoursReasons
  })
}

export default handler