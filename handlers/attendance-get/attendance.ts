import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import * as permissionFunctions from '../../helpers/functions.permissions.js'

import type * as recordTypes from '../../types/recordTypes'
import { getCallOutLists } from '../../database/getCallOutLists.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  let callOutLists: recordTypes.CallOutList[] = []

  if (
    configFunctions.getProperty('features.attendance.callOuts') &&
    permissionFunctions.hasPermission(
      request.session.user!,
      'attendance.callOuts.canView'
    )
  ) {
    callOutLists = await getCallOutLists()
  }

  response.render('attendance', {
    headTitle: 'Employee Attendance',
    callOutLists
  })
}

export default handler
