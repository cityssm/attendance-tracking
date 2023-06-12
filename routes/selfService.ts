import { Router, type RequestHandler } from 'express'

import handler_selfService from '../handlers/selfService-get/selfService.js'
import handler_doAddEmployeeToCallOutList from '../handlers/selfService-post/doAddEmployeeToCallOutList.js'
import handler_doGetAvailableCallOutLists from '../handlers/selfService-post/doGetAvailableCallOutLists.js'
import handler_doValidateEmployee from '../handlers/selfService-post/doValidateEmployee.js'
import * as configFunctions from '../helpers/functions.config.js'

export const router = Router()

router.get('/', handler_selfService as RequestHandler)

router.post('/doValidateEmployee', handler_doValidateEmployee as RequestHandler)

if (configFunctions.getProperty('features.attendance.callOuts')) {
  router.post(
    '/doGetAvailableCallOutLists',
    handler_doGetAvailableCallOutLists as RequestHandler
  )

  router.post(
    '/doAddEmployeeToCallOutList',
    handler_doAddEmployeeToCallOutList as RequestHandler
  )
}

export default router
