import { Router, type RequestHandler } from 'express'

import handler_selfService from '../handlers/selfService-get/selfService.js'
import handler_doValidateEmployee from '../handlers/selfService-post/doValidateEmployee.js'

export const router = Router()

router.get('/', handler_selfService as RequestHandler)

router.post('/doValidateEmployee', handler_doValidateEmployee as RequestHandler)

export default router
