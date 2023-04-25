import { Router } from 'express';
import handler_attendance from '../handlers/attendance-get/attendance.js';
export const router = Router();
router.get('/', handler_attendance);
export default router;
