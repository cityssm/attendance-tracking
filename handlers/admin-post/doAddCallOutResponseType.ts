import type { Request, Response } from 'express'

import {
  type AddCallOutResponseTypeForm,
  addCallOutResponseType
} from '../../database/addCallOutResponseType.js'
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js'
import type { CallOutResponseType } from '../../types/recordTypes.js'

export interface DoAddCallOutResponseTypeResponse {
  success: true
  responseTypeId: string
  callOutResponseTypes: CallOutResponseType[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const responseTypeId = await addCallOutResponseType(
    request.body as AddCallOutResponseTypeForm,
    request.session.user as AttendUser
  )

  const callOutResponseTypes = await getCallOutResponseTypes()

  const responseJson: DoAddCallOutResponseTypeResponse = {
    success: true,
    responseTypeId,
    callOutResponseTypes
  }

  response.json(responseJson)
}

export default handler
