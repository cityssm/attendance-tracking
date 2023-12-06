import type { Request, Response } from 'express'

import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getCallOutRecords } from '../../database/getCallOutRecords.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import { getConfigProperty } from '../../helpers/functions.config.js'
import { hasPermission } from '../../helpers/functions.permissions.js'
import type {
  AbsenceRecord,
  CallOutRecord,
  ReturnToWorkRecord
} from '../../types/recordTypes.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  let absenceRecords: AbsenceRecord[] = []

  if (
    getConfigProperty('features.attendance.absences') &&
    hasPermission(
      request.session.user as AttendUser,
      'attendance.absences.canView'
    )
  ) {
    absenceRecords = await getAbsenceRecords(
      {
        employeeNumber: request.body.employeeNumber,
        recentOnly: true,
        todayOnly: false
      },
      {},
      request.session.user as AttendUser
    )
  }

  let returnToWorkRecords: ReturnToWorkRecord[] = []

  if (
    getConfigProperty('features.attendance.returnsToWork') &&
    hasPermission(
      request.session.user as AttendUser,
      'attendance.returnsToWork.canView'
    )
  ) {
    returnToWorkRecords = await getReturnToWorkRecords(
      {
        employeeNumber: request.body.employeeNumber,
        recentOnly: true,
        todayOnly: false
      },
      request.session.user as AttendUser
    )
  }

  let callOutRecords: CallOutRecord[] = []

  if (
    getConfigProperty('features.attendance.callOuts') &&
    hasPermission(
      request.session.user as AttendUser,
      'attendance.callOuts.canView'
    )
  ) {
    callOutRecords = await getCallOutRecords({
      employeeNumber: request.body.employeeNumber,
      recentOnly: true
    })
  }

  response.json({
    absenceRecords,
    returnToWorkRecords,
    callOutRecords
  })
}

export default handler
