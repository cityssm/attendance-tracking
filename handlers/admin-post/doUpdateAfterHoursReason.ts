import type { Request, Response } from 'express'

import { updateAfterHoursReason } from '../../database/updateAfterHoursReason.js'
import type { AfterHoursReason } from '../../types/recordTypes.js'

export interface DoUpdateAfterHoursReasonResponse {
  success: boolean
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateAfterHoursReason(
    request.body as AfterHoursReason,
    request.session.user as AttendUser
  )

  const responseJson: DoUpdateAfterHoursReasonResponse = { success }

  response.json(responseJson)
}

export default handler
