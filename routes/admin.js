import { Router } from 'express';
import handler_employees from '../handlers/admin-get/employees.js';
export const router = Router();
router.get('/employees', handler_employees);
export default router;
