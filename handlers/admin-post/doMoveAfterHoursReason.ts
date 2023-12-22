// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom,
  moveRecordUp,
  moveRecordUpToTop
} from '../../database/moveRecord.js'
import { getAfterHoursReasons } from '../../helpers/functions.cache.js'
import type { AfterHoursReason } from '../../types/recordTypes.js'

export interface DoMoveAfterHoursReasonResponse {
  success: boolean
  afterHoursReasons: AfterHoursReason[]
}

export async function doMoveAfterHoursReasonDownHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom(
          'AfterHoursReasons',
          request.body.afterHoursReasonId as string
        )
      : await moveRecordDown(
          'AfterHoursReasons',
          request.body.afterHoursReasonId as string
        )

  const afterHoursReasons = await getAfterHoursReasons()

  response.json({
    success,
    afterHoursReasons
  })
}

export async function doMoveAfterHoursReasonUpHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordUpToTop(
          'AfterHoursReasons',
          request.body.afterHoursReasonId as string
        )
      : await moveRecordUp(
          'AfterHoursReasons',
          request.body.afterHoursReasonId as string
        )

  const afterHoursReasons = await getAfterHoursReasons()

  response.json({
    success,
    afterHoursReasons
  })
}
