// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import { deleteReturnToWorkRecord } from '../../database/deleteReturnToWorkRecord.js'
import { getReturnToWorkRecord } from '../../database/getReturnToWorkRecord.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import type { ReturnToWorkRecord } from '../../types/recordTypes.js'

export type DoDeleteReturnToWorkRecordResponse =
  | {
      success: false
      errorMessage: string
    }
  | {
      success: boolean
      returnToWorkRecords: ReturnToWorkRecord[]
    }

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const recordId = request.body.recordId as string

  const returnToWorkRecord = await getReturnToWorkRecord(
    recordId,
    request.session.user as AttendUser
  )

  let responseJson: DoDeleteReturnToWorkRecordResponse

  if (returnToWorkRecord === undefined) {
    responseJson = {
      success: false,
      errorMessage: 'Return to work record not found.'
    }
  } else if (returnToWorkRecord.canUpdate as boolean) {
    const success = await deleteReturnToWorkRecord(
      recordId,
      request.session.user as AttendUser
    )

    const returnToWorkRecords = await getReturnToWorkRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      request.session.user as AttendUser
    )

    responseJson = {
      success,
      returnToWorkRecords
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
