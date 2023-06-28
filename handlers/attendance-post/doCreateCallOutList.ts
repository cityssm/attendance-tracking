import type { Request, Response } from 'express'

import { createCallOutList } from '../../database/createCallOutList.js'
import { getCallOutLists } from '../../database/getCallOutLists.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const listId = await createCallOutList(request.body, request.session.user!)

  const callOutLists = await getCallOutLists(
    { favouriteOnly: false },
    request.session.user!
  )

  response.json({
    success: true,
    listId,
    callOutLists
  })
}

export default handler
