import type { Request, Response } from 'express'

import { getCallOutLists } from '../../database/getCallOutLists.js'
import { removeFavouriteCallOutList } from '../../database/removeFavouriteCallOutList.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await removeFavouriteCallOutList(
    request.body.listId,
    request.session.user as AttendUser
  )

  const callOutLists = await getCallOutLists(
    { favouriteOnly: false },
    request.session.user as AttendUser
  )

  response.json({
    success,
    callOutLists
  })
}

export default handler
