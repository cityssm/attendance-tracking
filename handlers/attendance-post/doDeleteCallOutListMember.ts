import type { Request, Response } from 'express'

import { deleteCallOutListMember } from '../../database/deleteCallOutListMember.js'
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteCallOutListMember(
    request.body.listId,
    request.body.employeeNumber,
    request.session.user as MonTYUser
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
