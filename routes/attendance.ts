import {
  Router,
  type Request,
  type RequestHandler,
  type Response,
  type NextFunction
} from 'express'

import handler_attendance from '../handlers/attendance-get/attendance.js'
import handler_doAddAfterHoursRecord from '../handlers/attendance-post/doAddAfterHoursRecord.js'
import handler_doAddCallOutListMember from '../handlers/attendance-post/doAddCallOutListMember.js'
import handler_doAddCallOutRecord from '../handlers/attendance-post/doAddCallOutRecord.js'
import handler_doAddFavouriteCallOutList from '../handlers/attendance-post/doAddFavouriteCallOutList.js'
import handler_doCreateCallOutList from '../handlers/attendance-post/doCreateCallOutList.js'
import handler_doDeleteCallOutList from '../handlers/attendance-post/doDeleteCallOutList.js'
import handler_doDeleteCallOutListMember from '../handlers/attendance-post/doDeleteCallOutListMember.js'
import handler_doDeleteCallOutRecord from '../handlers/attendance-post/doDeleteCallOutRecord.js'
import handler_doGetAttendanceRecords from '../handlers/attendance-post/doGetAttendanceRecords.js'
import handler_doGetCallOutListMembers from '../handlers/attendance-post/doGetCallOutListMembers.js'
import handler_doGetCallOutRecords from '../handlers/attendance-post/doGetCallOutRecords.js'
import handler_doRecordCallIn from '../handlers/attendance-post/doRecordCallIn.js'
import handler_doRemoveFavouriteCallOutList from '../handlers/attendance-post/doRemoveFavouriteCallOutList.js'
import handler_doUpdateCallOutList from '../handlers/attendance-post/doUpdateCallOutList.js'
import { forbiddenJSON, forbiddenStatus } from '../handlers/permissions.js'
import * as configFunctions from '../helpers/functions.config.js'
import * as permissionFunctions from '../helpers/functions.permissions.js'

function callOutsViewPostHandler(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (
    permissionFunctions.hasPermission(
      request.session.user!,
      'attendance.callOuts.canView'
    )
  ) {
    next()
    return
  }

  response.status(forbiddenStatus).json(forbiddenJSON)
}

function callOutsUpdatePostHandler(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (
    permissionFunctions.hasPermission(
      request.session.user!,
      'attendance.callOuts.canUpdate'
    )
  ) {
    next()
    return
  }

  response.status(forbiddenStatus).json(forbiddenJSON)
}

function callOutsManagePostHandler(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (
    permissionFunctions.hasPermission(
      request.session.user!,
      'attendance.callOuts.canManage'
    )
  ) {
    next()
    return
  }

  response.status(forbiddenStatus).json(forbiddenJSON)
}

function afterHoursUpdatePostHandler(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (
    permissionFunctions.hasPermission(
      request.session.user!,
      'attendance.afterHours.canUpdate'
    )
  ) {
    next()
    return
  }

  response.status(forbiddenStatus).json(forbiddenJSON)
}

export const router = Router()

router.get('/', handler_attendance as RequestHandler)

/*
 * Absences / Returns to Work
 */

if (
  configFunctions.getProperty('features.attendance.absences') ||
  configFunctions.getProperty('features.attendance.returnsToWork')
) {
  router.post('/doRecordCallIn', handler_doRecordCallIn as RequestHandler)
}

/*
 * Call Outs
 */

if (configFunctions.getProperty('features.attendance.callOuts')) {
  router.post(
    '/doAddFavouriteCallOutList',
    handler_doAddFavouriteCallOutList as RequestHandler
  )

  router.post(
    '/doRemoveFavouriteCallOutList',
    handler_doRemoveFavouriteCallOutList as RequestHandler
  )

  router.post(
    '/doCreateCallOutList',
    callOutsManagePostHandler,
    handler_doCreateCallOutList as RequestHandler
  )

  router.post(
    '/doUpdateCallOutList',
    callOutsManagePostHandler,
    handler_doUpdateCallOutList as RequestHandler
  )

  router.post(
    '/doDeleteCallOutList',
    callOutsManagePostHandler,
    handler_doDeleteCallOutList as RequestHandler
  )

  router.post(
    '/doGetCallOutListMembers',
    callOutsViewPostHandler,
    handler_doGetCallOutListMembers as RequestHandler
  )

  router.post(
    '/doAddCallOutListMember',
    callOutsManagePostHandler,
    handler_doAddCallOutListMember as RequestHandler
  )

  router.post(
    '/doDeleteCallOutListMember',
    callOutsManagePostHandler,
    handler_doDeleteCallOutListMember as RequestHandler
  )

  router.post(
    '/doGetCallOutRecords',
    callOutsViewPostHandler,
    handler_doGetCallOutRecords as RequestHandler
  )

  router.post(
    '/doAddCallOutRecord',
    callOutsUpdatePostHandler,
    handler_doAddCallOutRecord as RequestHandler
  )

  router.post(
    '/doDeleteCallOutRecord',
    callOutsUpdatePostHandler,
    handler_doDeleteCallOutRecord as RequestHandler
  )
}

/*
 * After Hours
 */

if (configFunctions.getProperty('features.attendance.afterHours')) {
  router.post(
    '/doAddAfterHoursRecord',
    afterHoursUpdatePostHandler,
    handler_doAddAfterHoursRecord as RequestHandler
  )
}

/*
 * Employees
 */

router.post(
  '/doGetAttendanceRecords',
  handler_doGetAttendanceRecords as RequestHandler
)

export default router
