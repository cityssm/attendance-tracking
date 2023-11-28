import type { Request, Response } from 'express'

import { addCallOutListMember } from '../../database/addCallOutListMember.js'
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addCallOutListMember(
    request.body.listId,
    request.body.employeeNumber,
    request.session.user as AttendUser
  )

  const callOutListMembers = await getCallOutListMembers(
    { listId: request.body.listId },
    {}
  )

  response.json({
    success,
    callOutListMembers
  })
}

export default handler
