import type { Request, Response } from 'express'

import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getCallOutList } from '../../database/getCallOutList.js'
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js'
import { getEmployees } from '../../database/getEmployees.js'
import { hasPermission } from '../../helpers/functions.permissions.js'
import type {
  AbsenceRecord,
  CallOutListMember,
  Employee
} from '../../types/recordTypes.js'

export interface DoGetCallOutListMembersResponse {
  callOutListMembers: CallOutListMember[]
  availableEmployees: Employee[]
  absenceRecords: AbsenceRecord[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const listId = request.body.listId as string

  const callOutListMembers = await getCallOutListMembers({ listId }, {})

  let absenceRecords: AbsenceRecord[] = []
  let availableEmployees: Employee[] = []

  if (
    hasPermission(
      request.session.user as AttendUser,
      'attendance.callOuts.canManage'
    )
  ) {
    if (request.body.includeAvailableEmployees as boolean) {
      const callOutList = await getCallOutList(listId)

      availableEmployees = await getEmployees(
        {
          eligibilityFunction: {
            functionName: callOutList?.eligibilityFunction ?? '',
            employeePropertyName: callOutList?.employeePropertyName ?? ''
          },
          isActive: true
        },
        {
          includeProperties: false,
          orderBy: 'name'
        }
      )
    }

    if (
      hasPermission(
        request.session.user as AttendUser,
        'attendance.absences.canView'
      )
    ) {
      absenceRecords = await getAbsenceRecords(
        {
          recentOnly: true,
          todayOnly: true
        },
        {},
        request.session.user as AttendUser
      )
    }
  }

  const responseJson: DoGetCallOutListMembersResponse = {
    callOutListMembers,
    availableEmployees,
    absenceRecords
  }

  response.json(responseJson)
}

export default handler
