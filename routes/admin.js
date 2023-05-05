import { Router } from 'express';
import handler_employees from '../handlers/admin-get/employees.js';
import handler_doGetEmployeeProperties from '../handlers/admin-post/doGetEmployeeProperties.js';
import handler_doUpdateEmployee from '../handlers/admin-post/doUpdateEmployee.js';
export const router = Router();
router.get('/employees', handler_employees);
router.post('/doGetEmployeeProperties', handler_doGetEmployeeProperties);
router.post('/doUpdateEmployee', handler_doUpdateEmployee);
export default router;
