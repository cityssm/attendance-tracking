import type { Request, Response } from 'express'

import { addAfterHoursRecord } from '../../database/addAfterHoursRecord.js'
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const recordId = await addAfterHoursRecord(request.body, request.session)

  const afterHoursRecords = await getAfterHoursRecords({
    recentOnly: true,
    todayOnly: false
  })

  response.json({
    success: true,
    recordId,
    afterHoursRecords
  })
}

export default handler
