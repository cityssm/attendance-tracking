import type { Request, Response } from 'express'

import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getCallOutRecords } from '../../database/getCallOutRecords.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import * as configFunctions from '../../helpers/functions.config.js'
import * as permissionFunctions from '../../helpers/functions.permissions.js'
import type * as recordTypes from '../../types/recordTypes'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  let absenceRecords: recordTypes.AbsenceRecord[] = []

  if (
    configFunctions.getProperty('features.attendance.absences') &&
    permissionFunctions.hasPermission(
      request.session.user!,
      'attendance.absences.canView'
    )
  ) {
    absenceRecords = await getAbsenceRecords(
      {
        employeeNumber: request.body.employeeNumber,
        recentOnly: true,
        todayOnly: false
      },
      request.session
    )
  }

  let returnToWorkRecords: recordTypes.ReturnToWorkRecord[] = []

  if (
    configFunctions.getProperty('features.attendance.returnsToWork') &&
    permissionFunctions.hasPermission(
      request.session.user!,
      'attendance.returnsToWork.canView'
    )
  ) {
    returnToWorkRecords = await getReturnToWorkRecords({
      employeeNumber: request.body.employeeNumber,
      recentOnly: true,
      todayOnly: false
    })
  }

  let callOutRecords: recordTypes.CallOutRecord[] = []

  if (
    configFunctions.getProperty('features.attendance.callOuts') &&
    permissionFunctions.hasPermission(
      request.session.user!,
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
