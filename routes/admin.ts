import { Router, type RequestHandler } from 'express'

import handler_employees from '../handlers/admin-get/employees.js'

import handler_doGetEmployeeProperties from '../handlers/admin-post/doGetEmployeeProperties.js'

import handler_doUpdateEmployee from '../handlers/admin-post/doUpdateEmployee.js'

import handler_doAddEmployeeProperty from '../handlers/admin-post/doAddEmployeeProperty.js'
import handler_doUpdateEmployeeProperty from '../handlers/admin-post/doUpdateEmployeeProperty.js'
import handler_doDeleteEmployeeProperty from '../handlers/admin-post/doDeleteEmployeeProperty.js'

export const router = Router()

router.get('/employees', handler_employees as RequestHandler)

router.post(
  '/doGetEmployeeProperties',
  handler_doGetEmployeeProperties as RequestHandler
)

router.post('/doUpdateEmployee', handler_doUpdateEmployee as RequestHandler)

router.post(
  '/doAddEmployeeProperty',
  handler_doAddEmployeeProperty as RequestHandler
)

router.post(
  '/doUpdateEmployeeProperty',
  handler_doUpdateEmployeeProperty as RequestHandler
)

router.post(
  '/doDeleteEmployeeProperty',
  handler_doDeleteEmployeeProperty as RequestHandler
)

export default router
