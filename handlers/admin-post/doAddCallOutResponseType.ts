import type { Request, Response } from 'express'

import { addCallOutResponseType } from '../../database/addCallOutResponseType.js'
import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const responseTypeId = await addCallOutResponseType(
    request.body,
    request.session
  )

  const callOutResponseTypes = await getCallOutResponseTypes()

  response.json({
    success: true,
    responseTypeId,
    callOutResponseTypes
  })
}

export default handler
