import type { Request, Response } from 'express'

import { addAfterHoursRecord } from '../../database/addAfterHoursRecord.js'
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const recordId = await addAfterHoursRecord(request.body, request.session.user as MonTYUser)

  const afterHoursRecords = await getAfterHoursRecords(
    {
      recentOnly: true,
      todayOnly: false
    },
    request.session.user as MonTYUser
  )

  response.json({
    success: true,
    recordId,
    afterHoursRecords
  })
}

export default handler
