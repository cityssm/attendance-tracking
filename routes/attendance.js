import { Router } from 'express';
import * as permissionFunctions from '../helpers/functions.permissions.js';
import handler_attendance from '../handlers/attendance-get/attendance.js';
import handler_doCreateCallOutList from '../handlers/attendance-post/doCreateCallOutList.js';
import { forbiddenJSON, forbiddenStatus } from '../handlers/permissions.js';
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
router.post('/doCreateCallOutList', callOutsManagePostHandler, handler_doCreateCallOutList);
export default router;
