import type { Request, Response } from 'express'

import { deleteCallOutList } from '../../database/deleteCallOutList.js'

import { getCallOutLists } from '../../database/getCallOutLists.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteCallOutList(request.body.listId, request.session)

  const callOutLists = await getCallOutLists()

  response.json({
    success,
    callOutLists
  })
}

export default handler
