import { Router, type RequestHandler } from 'express'

import handler_employees from '../handlers/admin-get/employees.js'
import handler_tables from '../handlers/admin-get/tables.js'
import handler_users from '../handlers/admin-get/users.js'
import handler_doAddAbsenceType from '../handlers/admin-post/doAddAbsenceType.js'
import handler_doAddAfterHoursReason from '../handlers/admin-post/doAddAfterHoursReason.js'
import handler_doAddCallOutResponseType from '../handlers/admin-post/doAddCallOutResponseType.js'
import handler_doAddEmployee from '../handlers/admin-post/doAddEmployee.js'
import handler_doAddEmployeeProperty from '../handlers/admin-post/doAddEmployeeProperty.js'
import handler_doAddUser from '../handlers/admin-post/doAddUser.js'
import handler_doDeleteAbsenceType from '../handlers/admin-post/doDeleteAbsenceType.js'
import handler_doDeleteAfterHoursReason from '../handlers/admin-post/doDeleteAfterHoursReason.js'
import handler_doDeleteCallOutResponseType from '../handlers/admin-post/doDeleteCallOutResponseType.js'
import handler_doDeleteEmployee from '../handlers/admin-post/doDeleteEmployee.js'
import handler_doDeleteEmployeeProperty from '../handlers/admin-post/doDeleteEmployeeProperty.js'
import handler_doDeleteUser from '../handlers/admin-post/doDeleteUser.js'
import handler_doGetEmployeeProperties from '../handlers/admin-post/doGetEmployeeProperties.js'
import handler_doGetUserPermissions from '../handlers/admin-post/doGetUserPermissions.js'
import {
  doMoveAbsenceTypeDownHandler,
  doMoveAbsenceTypeUpHandler
} from '../handlers/admin-post/doMoveAbsenceType.js'
import {
  doMoveAfterHoursReasonDownHandler,
  doMoveAfterHoursReasonUpHandler
} from '../handlers/admin-post/doMoveAfterHoursReason.js'
import {
  doMoveCallOutResponseTypeDownHandler,
  doMoveCallOutResponseTypeUpHandler
} from '../handlers/admin-post/doMoveCallOutResponseType.js'
import handler_doSetUserPermission from '../handlers/admin-post/doSetUserPermission.js'
import handler_doUpdateAbsenceType from '../handlers/admin-post/doUpdateAbsenceType.js'
import handler_doUpdateAfterHoursReason from '../handlers/admin-post/doUpdateAfterHoursReason.js'
import handler_doUpdateCallOutResponseType from '../handlers/admin-post/doUpdateCallOutResponseType.js'
import handler_doUpdateEmployee from '../handlers/admin-post/doUpdateEmployee.js'
import handler_doUpdateEmployeeProperty from '../handlers/admin-post/doUpdateEmployeeProperty.js'
import {
  doUpdateUserCanLoginHandler,
  doUpdateUserIsAdminHandler
} from '../handlers/admin-post/doUpdateUser.js'

export const router = Router()

/*
 * Employee Maintenance
 */

router.get('/employees', handler_employees as RequestHandler)

router.post(
  '/doGetEmployeeProperties',
  handler_doGetEmployeeProperties as RequestHandler
)

router.post('/doAddEmployee', handler_doAddEmployee as RequestHandler)

router.post('/doUpdateEmployee', handler_doUpdateEmployee as RequestHandler)

router.post('/doDeleteEmployee', handler_doDeleteEmployee as RequestHandler)

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

/*
 * Table Maintenance
 */

router.get('/tables', handler_tables as RequestHandler)

// Absence Types

router.post('/doAddAbsenceType', handler_doAddAbsenceType as RequestHandler)

router.post(
  '/doUpdateAbsenceType',
  handler_doUpdateAbsenceType as RequestHandler
)

router.post(
  '/doMoveAbsenceTypeUp',
  doMoveAbsenceTypeUpHandler as RequestHandler
)

router.post(
  '/doMoveAbsenceTypeDown',
  doMoveAbsenceTypeDownHandler as RequestHandler
)

router.post(
  '/doDeleteAbsenceType',
  handler_doDeleteAbsenceType as RequestHandler
)

// Call Out Response Types

router.post(
  '/doAddCallOutResponseType',
  handler_doAddCallOutResponseType as RequestHandler
)

router.post(
  '/doUpdateCallOutResponseType',
  handler_doUpdateCallOutResponseType as RequestHandler
)

router.post(
  '/doMoveCallOutResponseTypeUp',
  doMoveCallOutResponseTypeUpHandler as RequestHandler
)

router.post(
  '/doMoveCallOutResponseTypeDown',
  doMoveCallOutResponseTypeDownHandler as RequestHandler
)

router.post(
  '/doDeleteCallOutResponseType',
  handler_doDeleteCallOutResponseType as RequestHandler
)

// After Hours Reasons

router.post(
  '/doAddAfterHoursReason',
  handler_doAddAfterHoursReason as RequestHandler
)

router.post(
  '/doUpdateAfterHoursReason',
  handler_doUpdateAfterHoursReason as RequestHandler
)

router.post(
  '/doMoveAfterHoursReasonUp',
  doMoveAfterHoursReasonUpHandler as RequestHandler
)

router.post(
  '/doMoveAfterHoursReasonDown',
  doMoveAfterHoursReasonDownHandler as RequestHandler
)

router.post(
  '/doDeleteAfterHoursReason',
  handler_doDeleteAfterHoursReason as RequestHandler
)

/*
 * User Maintenance
 */

router.get('/users', handler_users as RequestHandler)

router.post(
  '/doUpdateUserCanLogin',
  doUpdateUserCanLoginHandler as RequestHandler
)

router.post(
  '/doUpdateUserIsAdmin',
  doUpdateUserIsAdminHandler as RequestHandler
)

router.post(
  '/doGetUserPermissions',
  handler_doGetUserPermissions as RequestHandler
)

router.post(
  '/doSetUserPermission',
  handler_doSetUserPermission as RequestHandler
)

router.post('/doAddUser', handler_doAddUser as RequestHandler)

router.post('/doDeleteUser', handler_doDeleteUser as RequestHandler)

export default router
