import { Router } from 'express';
import handler_selfService from '../handlers/selfService-get/selfService.js';
import handler_doValidateEmployee from '../handlers/selfService-post/doValidateEmployee.js';
export const router = Router();
router.get('/', handler_selfService);
router.post('/doValidateEmployee', handler_doValidateEmployee);
export default router;
