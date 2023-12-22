import type { Request, Response } from 'express'

import { deleteCallOutList } from '../../database/deleteCallOutList.js'
import { getCallOutLists } from '../../database/getCallOutLists.js'
import type { CallOutList } from '../../types/recordTypes.js'

export interface DoDeleteCallOutListResponse {
  success: boolean
  callOutLists: CallOutList[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteCallOutList(
    request.body.listId as string,
    request.session.user as AttendUser
  )

  const callOutLists = await getCallOutLists(
    { favouriteOnly: false },
    request.session.user as AttendUser
  )

  const responseJson: DoDeleteCallOutListResponse = {
    success,
    callOutLists
  }

  response.json(responseJson)
}

export default handler
