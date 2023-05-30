import type { Request, Response } from 'express'

import { moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js'
import { getAfterHoursReasons } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordUpToTop('AfterHoursReasons', request.body.afterHoursReasonId)
      : await moveRecordUp('AfterHoursReasons', request.body.afterHoursReasonId)

  const afterHoursReasons = await getAfterHoursReasons()

  response.json({
    success,
    afterHoursReasons
  })
}

export default handler
