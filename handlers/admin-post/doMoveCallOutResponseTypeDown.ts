/* eslint-disable @typescript-eslint/indent */
import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom
} from '../../database/moveRecord.js'
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom(
          'CallOutResponseTypes',
          request.body.responseTypeId
        )
      : await moveRecordDown(
          'CallOutResponseTypes',
          request.body.responseTypeId
        )

  const callOutResponseTypes = await getCallOutResponseTypes()

  response.json({
    success,
    callOutResponseTypes
  })
}

export default handler
