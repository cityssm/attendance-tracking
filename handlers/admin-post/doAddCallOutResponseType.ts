import type { Request, Response } from 'express'

import { addCallOutResponseType } from '../../database/addCallOutResponseType.js'
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const responseTypeId = await addCallOutResponseType(
    request.body,
    request.session.user!
  )

  const callOutResponseTypes = await getCallOutResponseTypes()

  response.json({
    success: true,
    responseTypeId,
    callOutResponseTypes
  })
}

export default handler
