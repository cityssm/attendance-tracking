// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom,
  moveRecordUp,
  moveRecordUpToTop
} from '../../database/moveRecord.js'
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js'
import type { CallOutResponseType } from '../../types/recordTypes.js'

export interface DoMoveCallOutResponseTypeResponse {
  success: boolean
  callOutResponseTypes: CallOutResponseType[]
}

export async function doMoveCallOutResponseTypeDownHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom(
          'CallOutResponseTypes',
          request.body.responseTypeId as string
        )
      : await moveRecordDown(
          'CallOutResponseTypes',
          request.body.responseTypeId as string
        )

  const callOutResponseTypes = await getCallOutResponseTypes()

  const responseJson: DoMoveCallOutResponseTypeResponse = {
    success,
    callOutResponseTypes
  }

  response.json(responseJson)
}

export async function doMoveCallOutResponseTypeUpHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordUpToTop(
          'CallOutResponseTypes',
          request.body.responseTypeId as string
        )
      : await moveRecordUp(
          'CallOutResponseTypes',
          request.body.responseTypeId as string
        )

  const callOutResponseTypes = await getCallOutResponseTypes()

  const responseJson: DoMoveCallOutResponseTypeResponse = {
    success,
    callOutResponseTypes
  }

  response.json(responseJson)
}
