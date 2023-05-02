import type { Request, Response } from 'express'

import { updateCallOutList } from '../../database/updateCallOutList.js'

import { getCallOutLists } from '../../database/getCallOutLists.js'
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js'
import { getEmployees } from '../../database/getEmployees.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateCallOutList(request.body, request.session)

  const callOutLists = await getCallOutLists()

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
