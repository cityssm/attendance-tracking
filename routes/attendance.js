import { Router } from 'express';
import handler_attendance from '../handlers/attendance-get/attendance.js';
import handler_doAddAfterHoursRecord from '../handlers/attendance-post/doAddAfterHoursRecord.js';
import handler_doAddCallOutListMember from '../handlers/attendance-post/doAddCallOutListMember.js';
import handler_doAddCallOutRecord from '../handlers/attendance-post/doAddCallOutRecord.js';
import handler_doCreateCallOutList from '../handlers/attendance-post/doCreateCallOutList.js';
import handler_doDeleteAbsenceRecord from '../handlers/attendance-post/doDeleteAbsenceRecord.js';
import handler_doDeleteAfterHoursRecord from '../handlers/attendance-post/doDeleteAfterHoursRecord.js';
import handler_doDeleteCallOutList from '../handlers/attendance-post/doDeleteCallOutList.js';
import handler_doDeleteCallOutListMember from '../handlers/attendance-post/doDeleteCallOutListMember.js';
import handler_doDeleteCallOutRecord from '../handlers/attendance-post/doDeleteCallOutRecord.js';
import handler_doDeleteReturnToWorkRecord from '../handlers/attendance-post/doDeleteReturnToWorkRecord.js';
import handler_doGetAttendanceRecords from '../handlers/attendance-post/doGetAttendanceRecords.js';
import handler_doGetCallOutListMembers from '../handlers/attendance-post/doGetCallOutListMembers.js';
import handler_doGetCallOutRecords from '../handlers/attendance-post/doGetCallOutRecords.js';
import handler_doRecordCallIn from '../handlers/attendance-post/doRecordCallIn.js';
import { doAddFavouriteCallOutListHandler, doRemoveFavouriteCallOutListHandler } from '../handlers/attendance-post/doToggleFavouriteCallOutList.js';
import handler_doUpdateCallOutList from '../handlers/attendance-post/doUpdateCallOutList.js';
import handler_doUpdateCallOutRecord from '../handlers/attendance-post/doUpdateCallOutRecord.js';
import { forbiddenJSON, forbiddenStatus } from '../handlers/permissions.js';
import { getConfigProperty } from '../helpers/functions.config.js';
import { hasPermission } from '../helpers/functions.permissions.js';
function callOutsViewPostHandler(request, response, next) {
    if (hasPermission(request.session.user, 'attendance.callOuts.canView')) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
function callOutsUpdatePostHandler(request, response, next) {
    if (hasPermission(request.session.user, 'attendance.callOuts.canUpdate')) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
function callOutsManagePostHandler(request, response, next) {
    if (hasPermission(request.session.user, 'attendance.callOuts.canManage')) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
function afterHoursUpdatePostHandler(request, response, next) {
    if (hasPermission(request.session.user, 'attendance.afterHours.canUpdate')) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
export const router = Router();
router.get('/', handler_attendance);
if (getConfigProperty('features.attendance.absences') ||
    getConfigProperty('features.attendance.returnsToWork')) {
    router.post('/doRecordCallIn', handler_doRecordCallIn);
    router.post('/doDeleteAbsenceRecord', handler_doDeleteAbsenceRecord);
    router.post('/doDeleteReturnToWorkRecord', handler_doDeleteReturnToWorkRecord);
}
if (getConfigProperty('features.attendance.callOuts')) {
    router.post('/doAddFavouriteCallOutList', doAddFavouriteCallOutListHandler);
    router.post('/doRemoveFavouriteCallOutList', doRemoveFavouriteCallOutListHandler);
    router.post('/doCreateCallOutList', callOutsManagePostHandler, handler_doCreateCallOutList);
    router.post('/doUpdateCallOutList', callOutsManagePostHandler, handler_doUpdateCallOutList);
    router.post('/doDeleteCallOutList', callOutsManagePostHandler, handler_doDeleteCallOutList);
    router.post('/doGetCallOutListMembers', callOutsViewPostHandler, handler_doGetCallOutListMembers);
    router.post('/doAddCallOutListMember', callOutsManagePostHandler, handler_doAddCallOutListMember);
    router.post('/doDeleteCallOutListMember', callOutsManagePostHandler, handler_doDeleteCallOutListMember);
    router.post('/doGetCallOutRecords', callOutsViewPostHandler, handler_doGetCallOutRecords);
    router.post('/doAddCallOutRecord', callOutsUpdatePostHandler, handler_doAddCallOutRecord);
    router.post('/doUpdateCallOutRecord', callOutsUpdatePostHandler, handler_doUpdateCallOutRecord);
    router.post('/doDeleteCallOutRecord', callOutsUpdatePostHandler, handler_doDeleteCallOutRecord);
}
if (getConfigProperty('features.attendance.afterHours')) {
    router.post('/doAddAfterHoursRecord', afterHoursUpdatePostHandler, handler_doAddAfterHoursRecord);
    router.post('/doDeleteAfterHoursRecord', afterHoursUpdatePostHandler, handler_doDeleteAfterHoursRecord);
}
router.post('/doGetAttendanceRecords', handler_doGetAttendanceRecords);
export default router;
