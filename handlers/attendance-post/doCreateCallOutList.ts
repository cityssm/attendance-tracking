import type { Request, Response } from 'express'

import { createCallOutList } from '../../database/createCallOutList.js'
import { getCallOutLists } from '../../database/getCallOutLists.js'
import type { CallOutList } from '../../types/recordTypes.js'

export interface DoCreateCallOutListResponse {
  success: boolean
  listId: string
  callOutLists: CallOutList[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const listId = await createCallOutList(
    request.body as CallOutList,
    request.session.user as AttendUser
  )

  const callOutLists = await getCallOutLists(
    { favouriteOnly: false },
    request.session.user as AttendUser
  )

  const responseJson: DoCreateCallOutListResponse = {
    success: true,
    listId,
    callOutLists
  }

  response.json(responseJson)
}

export default handler
