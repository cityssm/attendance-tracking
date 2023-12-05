import type { Request, Response } from 'express'

import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getCallOutList } from '../../database/getCallOutList.js'
import { getCallOutListMembers } from '../../database/getCallOutListMembers.js'
import { getEmployees } from '../../database/getEmployees.js'
import { hasPermission } from '../../helpers/functions.permissions.js'
import type { AbsenceRecord, Employee } from '../../types/recordTypes.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const listId = request.body.listId

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
        request.session.user as AttendUser
      )
    }
  }

  response.json({
    callOutListMembers,
    availableEmployees,
    absenceRecords
  })
}

export default handler
