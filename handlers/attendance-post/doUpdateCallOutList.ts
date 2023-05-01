import type { Request, Response } from 'express'

import { updateCallOutList } from '../../database/updateCallOutList.js'

import { getCallOutLists } from '../../database/getCallOutLists.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateCallOutList(request.body, request.session)

  const callOutLists = await getCallOutLists()

  response.json({
    success,
    callOutLists
  })
}

export default handler
