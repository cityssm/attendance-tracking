import {
  Router,
  type Request,
  type RequestHandler,
  type Response,
  type NextFunction
} from 'express'

import * as configFunctions from '../helpers/functions.config.js'
import * as permissionFunctions from '../helpers/functions.permissions.js'

import handler_reports from '../handlers/reports-get/reports.js'

export const router = Router()

router.get('/', handler_reports as RequestHandler)

export default router
