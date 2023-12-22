// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import { deleteAbsenceRecord } from '../../database/deleteAbsenceRecord.js'
import { getAbsenceRecord } from '../../database/getAbsenceRecord.js'
import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import type { AbsenceRecord } from '../../types/recordTypes.js'

export type DoDeleteAbsenceRecordResponse =
  | {
      success: false
      errorMessage: string
    }
  | {
      success: boolean
      absenceRecords: AbsenceRecord[]
    }

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const recordId = request.body.recordId as string

  const absenceRecord = await getAbsenceRecord(
    recordId,
    request.session.user as AttendUser
  )

  let responseJson: DoDeleteAbsenceRecordResponse

  if (absenceRecord === undefined) {
    responseJson = {
      success: false,
      errorMessage: 'Absence record not found.'
    }
  } else if (absenceRecord.canUpdate as boolean) {
    const success = await deleteAbsenceRecord(
      recordId,
      request.session.user as AttendUser
    )

    const absenceRecords = await getAbsenceRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      {},
      request.session.user as AttendUser
    )

    responseJson = {
      success,
      absenceRecords
    }
  } else {
    responseJson = {
      success: false,
      errorMessage: 'Access denied.'
    }
  }

  response.json(responseJson)
}

export default handler
