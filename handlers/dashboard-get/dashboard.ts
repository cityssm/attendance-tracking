import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import * as permissionFunctions from '../../helpers/functions.permissions.js'

import type * as recordTypes from '../../types/recordTypes'

import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import { getCallOutLists } from '../../database/getCallOutLists.js'
import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js'

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
    absenceRecords = await getAbsenceRecords({
      recentOnly: true,
      todayOnly: true
    })
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
      recentOnly: true,
      todayOnly: true
    })
  }

  let callOutLists: recordTypes.CallOutList[] = []
  let callOutResponseTypes: recordTypes.CallOutResponseType[] = []

  if (configFunctions.getProperty('features.attendance.callOuts')) {
    if (
      permissionFunctions.hasPermission(
        request.session.user!,
        'attendance.callOuts.canView'
      )
    ) {
      callOutLists = await getCallOutLists(
        { favouriteOnly: true },
        request.session
      )
    }

    if (
      permissionFunctions.hasPermission(
        request.session.user!,
        'attendance.callOuts.canUpdate'
      )
    ) {
      callOutResponseTypes = await getCallOutResponseTypes()
    }
  }

  response.render('dashboard', {
    headTitle: 'Dashboard',
    absenceRecords,
    returnToWorkRecords,
    callOutLists,
    callOutResponseTypes
  })
}

export default handler
