import type { Request, Response } from 'express'

import { deleteCallOutResponseType } from '../../database/deleteCallOutResponseType.js'
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js'
import type { CallOutResponseType } from '../../types/recordTypes.js'

export interface DoDeleteCallOutResponseTypeResponse {
  success: boolean
  callOutResponseTypes: CallOutResponseType[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteCallOutResponseType(
    request.body.responseTypeId as string,
    request.session.user as AttendUser
  )

  const callOutResponseTypes = await getCallOutResponseTypes()

  const responseJson: DoDeleteCallOutResponseTypeResponse = {
    success,
    callOutResponseTypes
  }

  response.json(responseJson)
}

export default handler
