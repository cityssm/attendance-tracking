import { Router } from 'express';
import handler_employees from '../handlers/admin-get/employees.js';
import handler_doGetEmployeeProperties from '../handlers/admin-post/doGetEmployeeProperties.js';
export const router = Router();
router.get('/employees', handler_employees);
router.post('/doGetEmployeeProperties', handler_doGetEmployeeProperties);
export default router;
