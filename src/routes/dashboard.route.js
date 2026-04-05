import express from 'express'
const router = express.Router();
import { getFinancialSummary } from '../controllers/dashboard.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { excessControl } from '../middlewares/role.middleware.js';

router.use(auth);
router.use(excessControl("admin", "analyst"));
router.get('/record/summary', getFinancialSummary);

export default router;