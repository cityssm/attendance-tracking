import { Router } from 'express';
import * as configFunctions from '../helpers/functions.config.js';
import * as permissionFunctions from '../helpers/functions.permissions.js';
import handler_attendance from '../handlers/attendance-get/attendance.js';
import handler_doCreateCallOutList from '../handlers/attendance-post/doCreateCallOutList.js';
import handler_doUpdateCallOutList from '../handlers/attendance-post/doUpdateCallOutList.js';
import handler_doGetCallOutListMembers from '../handlers/attendance-post/doGetCallOutListMembers.js';
import handler_doAddCallOutListMember from '../handlers/attendance-post/doAddCallOutListMember.js';
import handler_doDeleteCallOutListMember from '../handlers/attendance-post/doDeleteCallOutListMember.js';
import handler_doGetCallOutRecords from '../handlers/attendance-post/doGetCallOutRecords.js';
import handler_doAddCallOutRecord from '../handlers/attendance-post/doAddCallOutRecord.js';
import handler_doDeleteCallOutRecord from '../handlers/attendance-post/doDeleteCallOutRecord.js';
import { forbiddenJSON, forbiddenStatus } from '../handlers/permissions.js';
function callOutsViewPostHandler(request, response, next) {
    if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canView')) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
function callOutsUpdatePostHandler(request, response, next) {
    if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canUpdate')) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
function callOutsManagePostHandler(request, response, next) {
    if (permissionFunctions.hasPermission(request.session.user, 'attendance.callOuts.canManage')) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
export const router = Router();
router.get('/', handler_attendance);
if (configFunctions.getProperty('features.attendance.callOuts')) {
    router.post('/doCreateCallOutList', callOutsManagePostHandler, handler_doCreateCallOutList);
    router.post('/doUpdateCallOutList', callOutsManagePostHandler, handler_doUpdateCallOutList);
    router.post('/doGetCallOutListMembers', callOutsViewPostHandler, handler_doGetCallOutListMembers);
    router.post('/doAddCallOutListMember', callOutsManagePostHandler, handler_doAddCallOutListMember);
    router.post('/doDeleteCallOutListMember', callOutsManagePostHandler, handler_doDeleteCallOutListMember);
    router.post('/doGetCallOutRecords', callOutsViewPostHandler, handler_doGetCallOutRecords);
    router.post('/doAddCallOutRecord', callOutsUpdatePostHandler, handler_doAddCallOutRecord);
    router.post('/doDeleteCallOutRecord', callOutsUpdatePostHandler, handler_doDeleteCallOutRecord);
}
export default router;
