import type { Request, Response } from 'express'

import {
  type AddAfterHoursRecordForm,
  addAfterHoursRecord
} from '../../database/addAfterHoursRecord.js'
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js'
import type { AfterHoursRecord } from '../../types/recordTypes.js'

export interface DoAddAfterHoursRecordResponse {
  success: true
  recordId: string
  afterHoursRecords: AfterHoursRecord[]
}

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

  const responseJson: DoAddAfterHoursRecordResponse = {
    success: true,
    recordId,
    afterHoursRecords
  }

  response.json(responseJson)
}

export default handler
