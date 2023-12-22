import type { Request, Response } from 'express'

import {
  type AddAfterHoursRecordForm,
  addAfterHoursRecord
} from '../../database/addAfterHoursRecord.js'
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const recordId = await addAfterHoursRecord(
    request.body as AddAfterHoursRecordForm,
    request.session.user as AttendUser
  )

  const afterHoursRecords = await getAfterHoursRecords(
    {
      recentOnly: true,
      todayOnly: false
    },
    request.session.user as AttendUser
  )

  response.json({
    success: true,
    recordId,
    afterHoursRecords
  })
}

export default handler
