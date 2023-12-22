import type { Request, Response } from 'express'

import {
  type AddAfterHoursReasonForm,
  addAfterHoursReason
} from '../../database/addAfterHoursReason.js'
import { getAfterHoursReasons } from '../../helpers/functions.cache.js'
import type { AfterHoursReason } from '../../types/recordTypes.js'

export interface DoAddAfterHoursReasonResponse {
  success: true
  afterHoursReasonId: number
  afterHoursReasons: AfterHoursReason[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const afterHoursReasonId = await addAfterHoursReason(
    request.body as AddAfterHoursReasonForm,
    request.session.user as AttendUser
  )

  const afterHoursReasons = await getAfterHoursReasons()

  const responseJson: DoAddAfterHoursReasonResponse = {
    success: true,
    afterHoursReasonId,
    afterHoursReasons
  }

  response.json(responseJson)
}

export default handler
