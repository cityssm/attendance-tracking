// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import { deleteAfterHoursRecord } from '../../database/deleteAfterHoursRecord.js'
import { getAfterHoursRecord } from '../../database/getAfterHoursRecord.js'
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js'
import type { AfterHoursRecord } from '../../types/recordTypes.js'

export type DoDeleteAfterHoursRecordResponse =
  | {
      success: false
      errorMessage: string
    }
  | {
      success: boolean
      afterHoursRecords: AfterHoursRecord[]
    }

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const recordId = request.body.recordId as string

  const afterHoursRecord = await getAfterHoursRecord(
    recordId,
    request.session.user as AttendUser
  )

  let responseJson: DoDeleteAfterHoursRecordResponse

  if (afterHoursRecord === undefined) {
    responseJson = {
      success: false,
      errorMessage: 'After hours record not found.'
    }
  } else if (afterHoursRecord.canUpdate as boolean) {
    const success = await deleteAfterHoursRecord(
      recordId,
      request.session.user as AttendUser
    )

    const afterHoursRecords = await getAfterHoursRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      request.session.user as AttendUser
    )

    responseJson = {
      success,
      afterHoursRecords
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
