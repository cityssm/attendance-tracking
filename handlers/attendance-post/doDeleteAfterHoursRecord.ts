import type { Request, Response } from 'express'

import { deleteAfterHoursRecord } from '../../database/deleteAfterHoursRecord.js'
import { getAfterHoursRecord } from '../../database/getAfterHoursRecord.js'
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js'

export async function handler(
  request: Request,
  response: Response
): Promise<unknown> {
  const recordId = request.body.recordId

  const afterHoursRecord = await getAfterHoursRecord(recordId, request.session)

  if (afterHoursRecord === undefined) {
    return response.json({
      success: false,
      errorMessage: 'After hours record not found.'
    })
  }

  if (!(afterHoursRecord.canUpdate as boolean)) {
    return response.json({
      success: false,
      errorMessage: 'Access denied.'
    })
  }

  const success = await deleteAfterHoursRecord(recordId, request.session)

  const afterHoursRecords = await getAfterHoursRecords(
    {
      recentOnly: true,
      todayOnly: false
    },
    request.session
  )

  response.json({
    success,
    afterHoursRecords
  })
}

export default handler
