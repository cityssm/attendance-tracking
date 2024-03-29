import { Router } from 'express';
import handler_employees from '../handlers/admin-get/employees.js';
import handler_tables from '../handlers/admin-get/tables.js';
import handler_users from '../handlers/admin-get/users.js';
import handler_doAddAbsenceType from '../handlers/admin-post/doAddAbsenceType.js';
import handler_doAddAfterHoursReason from '../handlers/admin-post/doAddAfterHoursReason.js';
import handler_doAddCallOutResponseType from '../handlers/admin-post/doAddCallOutResponseType.js';
import handler_doAddEmployee from '../handlers/admin-post/doAddEmployee.js';
import handler_doClearUserPermissions from '../handlers/admin-post/doClearUserPermissions.js';
import handler_doDeleteAbsenceType from '../handlers/admin-post/doDeleteAbsenceType.js';
import handler_doDeleteAfterHoursReason from '../handlers/admin-post/doDeleteAfterHoursReason.js';
import handler_doDeleteCallOutResponseType from '../handlers/admin-post/doDeleteCallOutResponseType.js';
import handler_doDeleteEmployee from '../handlers/admin-post/doDeleteEmployee.js';
import handler_doGetEmployeeProperties from '../handlers/admin-post/doGetEmployeeProperties.js';
import handler_doGetUserPermissions from '../handlers/admin-post/doGetUserPermissions.js';
import { doAddEmployeePropertyHandler, doDeleteEmployeePropertyHandler, doUpdateEmployeePropertyHandler } from '../handlers/admin-post/doModifyEmployeeProperty.js';
import { doAddUserHandler, doDeleteUserHandler, doUpdateUserCanLoginHandler, doUpdateUserIsAdminHandler } from '../handlers/admin-post/doModifyUser.js';
import { doMoveAbsenceTypeDownHandler, doMoveAbsenceTypeUpHandler } from '../handlers/admin-post/doMoveAbsenceType.js';
import { doMoveAfterHoursReasonDownHandler, doMoveAfterHoursReasonUpHandler } from '../handlers/admin-post/doMoveAfterHoursReason.js';
import { doMoveCallOutResponseTypeDownHandler, doMoveCallOutResponseTypeUpHandler } from '../handlers/admin-post/doMoveCallOutResponseType.js';
import handler_doSetUserPermission from '../handlers/admin-post/doSetUserPermission.js';
import handler_doUpdateAbsenceType from '../handlers/admin-post/doUpdateAbsenceType.js';
import handler_doUpdateAfterHoursReason from '../handlers/admin-post/doUpdateAfterHoursReason.js';
import handler_doUpdateCallOutResponseType from '../handlers/admin-post/doUpdateCallOutResponseType.js';
import handler_doUpdateEmployee from '../handlers/admin-post/doUpdateEmployee.js';
export const router = Router();
router.get('/employees', handler_employees);
router.post('/doGetEmployeeProperties', handler_doGetEmployeeProperties);
router.post('/doAddEmployee', handler_doAddEmployee);
router.post('/doUpdateEmployee', handler_doUpdateEmployee);
router.post('/doDeleteEmployee', handler_doDeleteEmployee);
router.post('/doAddEmployeeProperty', doAddEmployeePropertyHandler);
router.post('/doUpdateEmployeeProperty', doUpdateEmployeePropertyHandler);
router.post('/doDeleteEmployeeProperty', doDeleteEmployeePropertyHandler);
router.get('/tables', handler_tables);
router.post('/doAddAbsenceType', handler_doAddAbsenceType);
router.post('/doUpdateAbsenceType', handler_doUpdateAbsenceType);
router.post('/doMoveAbsenceTypeUp', doMoveAbsenceTypeUpHandler);
router.post('/doMoveAbsenceTypeDown', doMoveAbsenceTypeDownHandler);
router.post('/doDeleteAbsenceType', handler_doDeleteAbsenceType);
router.post('/doAddCallOutResponseType', handler_doAddCallOutResponseType);
router.post('/doUpdateCallOutResponseType', handler_doUpdateCallOutResponseType);
router.post('/doMoveCallOutResponseTypeUp', doMoveCallOutResponseTypeUpHandler);
router.post('/doMoveCallOutResponseTypeDown', doMoveCallOutResponseTypeDownHandler);
router.post('/doDeleteCallOutResponseType', handler_doDeleteCallOutResponseType);
router.post('/doAddAfterHoursReason', handler_doAddAfterHoursReason);
router.post('/doUpdateAfterHoursReason', handler_doUpdateAfterHoursReason);
router.post('/doMoveAfterHoursReasonUp', doMoveAfterHoursReasonUpHandler);
router.post('/doMoveAfterHoursReasonDown', doMoveAfterHoursReasonDownHandler);
router.post('/doDeleteAfterHoursReason', handler_doDeleteAfterHoursReason);
router.get('/users', handler_users);
router.post('/doUpdateUserCanLogin', doUpdateUserCanLoginHandler);
router.post('/doUpdateUserIsAdmin', doUpdateUserIsAdminHandler);
router.post('/doGetUserPermissions', handler_doGetUserPermissions);
router.post('/doSetUserPermission', handler_doSetUserPermission);
router.post('/doClearUserPermissions', handler_doClearUserPermissions);
router.post('/doAddUser', doAddUserHandler);
router.post('/doDeleteUser', doDeleteUserHandler);
export default router;
