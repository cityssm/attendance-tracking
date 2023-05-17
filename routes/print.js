import { Router } from 'express';
import handler_screen from '../handlers/print-get/screen.js';
export const router = Router();
router.get('/screen/:printName', handler_screen);
export default router;
