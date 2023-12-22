import type { Request, Response } from 'express'

import { deleteCallOutListMember } from '../../database/deleteCallOutListMember.js'
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js'
import type { CallOutListMember } from '../../types/recordTypes.js'

export interface DoDeleteCallOutListMemberResponse {
  success: boolean
  callOutListMembers: CallOutListMember[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteCallOutListMember(
    request.body.listId as string,
    request.body.employeeNumber as string,
    request.session.user as AttendUser
  )

  const callOutListMembers = await getCallOutListMembers(
    { listId: request.body.listId },
    {}
  )

  const responseJson: DoDeleteCallOutListMemberResponse = {
    success,
    callOutListMembers
  }

  response.json(responseJson)
}

export default handler
