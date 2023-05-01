import {
  Router,
  type Request,
  type RequestHandler,
  type Response,
  type NextFunction
} from 'express'

import * as permissionFunctions from '../helpers/functions.permissions.js'

import handler_attendance from '../handlers/attendance-get/attendance.js'

import handler_doCreateCallOutList from '../handlers/attendance-post/doCreateCallOutList.js'
import handler_doUpdateCallOutList from '../handlers/attendance-post/doUpdateCallOutList.js'

import { forbiddenJSON, forbiddenStatus } from '../handlers/permissions.js'

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

export const router = Router()

router.get('/', handler_attendance as RequestHandler)

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

export default router
