import { Router, type RequestHandler } from 'express'

import handler_employees from '../handlers/admin-get/employees.js'

import handler_doGetEmployeeProperties from '../handlers/admin-post/doGetEmployeeProperties.js'

import handler_doUpdateEmployee from '../handlers/admin-post/doUpdateEmployee.js'

import handler_doAddEmployeeProperty from '../handlers/admin-post/doAddEmployeeProperty.js'
import handler_doUpdateEmployeeProperty from '../handlers/admin-post/doUpdateEmployeeProperty.js'
import handler_doDeleteEmployeeProperty from '../handlers/admin-post/doDeleteEmployeeProperty.js'

import handler_tables from '../handlers/admin-get/tables.js'

import handler_users from '../handlers/admin-get/users.js'

import handler_doUpdateUserCanLogin from '../handlers/admin-post/doUpdateUserCanLogin.js'
import handler_doUpdateUserIsAdmin from '../handlers/admin-post/doUpdateUserIsAdmin.js'
import handler_doGetUserPermissions from '../handlers/admin-post/doGetUserPermissions.js'
import handler_doSetUserPermission from '../handlers/admin-post/doSetUserPermission.js'
import handler_doAddUser from '../handlers/admin-post/doAddUser.js'
import handler_doDeleteUser from '../handlers/admin-post/doDeleteUser.js'

export const router = Router()

/*
 * Employee Maintenance
 */

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

/*
 * Table Maintenance
 */

router.get('/tables', handler_tables as RequestHandler)

/*
 * User Maintenance
 */

router.get('/users', handler_users as RequestHandler)

router.post(
  '/doUpdateUserCanLogin',
  handler_doUpdateUserCanLogin as RequestHandler
)

router.post(
  '/doUpdateUserIsAdmin',
  handler_doUpdateUserIsAdmin as RequestHandler
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
