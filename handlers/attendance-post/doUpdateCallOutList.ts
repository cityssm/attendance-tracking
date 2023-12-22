import type { Request, Response } from 'express'

import { getCallOutListMembers } from '../../database/getCallOutListMembers.js'
import { getCallOutLists } from '../../database/getCallOutLists.js'
import { getEmployees } from '../../database/getEmployees.js'
import { updateCallOutList } from '../../database/updateCallOutList.js'
import type {
  CallOutList,
  CallOutListMember,
  Employee
} from '../../types/recordTypes.js'

export interface DoUpdateCallOutListResponse {
  success: boolean
  callOutLists: CallOutList[]
  callOutListMembers: CallOutListMember[]
  availableEmployees: Employee[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const updateResponse = await updateCallOutList(
    request.body as CallOutList,
    request.session.user as AttendUser
  )

  const callOutLists = await getCallOutLists(
    { favouriteOnly: false },
    request.session.user as AttendUser
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

  const responseJson: DoUpdateCallOutListResponse = {
    success: updateResponse.success,
    callOutLists,
    callOutListMembers,
    availableEmployees
  }

  response.json(responseJson)
}

export default handler
