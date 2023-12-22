import type { Request, Response } from 'express'

import { addCallOutListMember } from '../../database/addCallOutListMember.js'
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js'
import type { CallOutListMember } from '../../types/recordTypes.js'

export interface DoAddCallOutListMemberResponse {
  success: boolean
  callOutListMembers: CallOutListMember[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addCallOutListMember(
    request.body.listId as string,
    request.body.employeeNumber as string,
    request.session.user as AttendUser
  )

  const callOutListMembers = await getCallOutListMembers(
    { listId: request.body.listId },
    {}
  )

  const responseJson: DoAddCallOutListMemberResponse = {
    success,
    callOutListMembers
  }

  response.json(responseJson)
}

export default handler
