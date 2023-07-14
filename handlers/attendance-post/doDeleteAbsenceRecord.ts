import type { Request, Response } from 'express'

import { deleteAbsenceRecord } from '../../database/deleteAbsenceRecord.js'
import { getAbsenceRecord } from '../../database/getAbsenceRecord.js'
import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'

export async function handler(
  request: Request,
  response: Response
): Promise<unknown> {
  const recordId = request.body.recordId

  const absenceRecord = await getAbsenceRecord(recordId, request.session.user!)

  if (absenceRecord === undefined) {
    response.json({
      success: false,
      errorMessage: 'Absence record not found.'
    })
    return
  }

  if (!(absenceRecord.canUpdate as boolean)) {
    response.json({
      success: false,
      errorMessage: 'Access denied.'
    })
    return
  }

  const success = await deleteAbsenceRecord(recordId, request.session.user!)

  const absenceRecords = await getAbsenceRecords(
    {
      recentOnly: true,
      todayOnly: false
    },
    request.session.user!
  )

  response.json({
    success,
    absenceRecords
  })
}

export default handler
