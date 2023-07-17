import type { Request, Response } from 'express'

import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getCallOutRecords } from '../../database/getCallOutRecords.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import { getConfigProperty } from '../../helpers/functions.config.js'
import * as permissionFunctions from '../../helpers/functions.permissions.js'
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
    permissionFunctions.hasPermission(
      request.session.user as MonTYUser,
      'attendance.absences.canView'
    )
  ) {
    absenceRecords = await getAbsenceRecords(
      {
        employeeNumber: request.body.employeeNumber,
        recentOnly: true,
        todayOnly: false
      },
      request.session.user as MonTYUser
    )
  }

  let returnToWorkRecords: ReturnToWorkRecord[] = []

  if (
    getConfigProperty('features.attendance.returnsToWork') &&
    permissionFunctions.hasPermission(
      request.session.user as MonTYUser,
      'attendance.returnsToWork.canView'
    )
  ) {
    returnToWorkRecords = await getReturnToWorkRecords(
      {
        employeeNumber: request.body.employeeNumber,
        recentOnly: true,
        todayOnly: false
      },
      request.session.user as MonTYUser
    )
  }

  let callOutRecords: CallOutRecord[] = []

  if (
    getConfigProperty('features.attendance.callOuts') &&
    permissionFunctions.hasPermission(
      request.session.user as MonTYUser,
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
