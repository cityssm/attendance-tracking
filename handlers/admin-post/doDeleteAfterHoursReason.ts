import type { Request, Response } from 'express'

import { deleteAfterHoursReason } from '../../database/deleteAfterHoursReason.js'
import { getAfterHoursReasons } from '../../helpers/functions.cache.js'
import type { AfterHoursReason } from '../../types/recordTypes.js'

export interface DoDeleteAfterHoursReasonResponse {
  success: boolean
  afterHoursReasons: AfterHoursReason[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteAfterHoursReason(
    request.body.afterHoursReasonId as string,
    request.session.user as AttendUser
  )

  const afterHoursReasons = await getAfterHoursReasons()

  const responseJson: DoDeleteAfterHoursReasonResponse = {
    success,
    afterHoursReasons
  }

  response.json(responseJson)
}

export default handler
