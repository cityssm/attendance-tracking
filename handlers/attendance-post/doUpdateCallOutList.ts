import type { Request, Response } from 'express'

import { getCallOutListMembers } from '../../database/getCallOutListMembers.js'
import { getCallOutLists } from '../../database/getCallOutLists.js'
import { getEmployees } from '../../database/getEmployees.js'
import { updateCallOutList } from '../../database/updateCallOutList.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateCallOutList(request.body, request.session.user!)

  const callOutLists = await getCallOutLists(
    { favouriteOnly: false },
    request.session.user!
  )

  const callOutListMembers = await getCallOutListMembers(
    {
      listId: request.body.listId
    },
    {
      includeSortKeyFunction: false
    }
  )

  const availableEmployees = await getEmployees(
    {
      eligibilityFunction: {
        functionName: request.body.eligibilityFunction ?? '',
        employeePropertyName: request.body.employeePropertyName ?? ''
      },
      isActive: true
    },
    {
      includeProperties: false,
      orderBy: 'name'
    }
  )

  response.json({
    success,
    callOutLists,
    callOutListMembers,
    availableEmployees
  })
}

export default handler
