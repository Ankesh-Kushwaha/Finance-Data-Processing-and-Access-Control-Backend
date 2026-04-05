import express from 'express';
import { getUsers,getAsingleUser,changeRole,changeStatus } from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { excessControl } from '../middlewares/role.middleware.js';
const router = express.Router();

router.get('/get-all-user', auth, getUsers);
router.post('/get-a-single-user', auth, getAsingleUser);
router.put('/change-role', auth, excessControl("admin"), changeRole);
router.put('/change-status', auth, excessControl("admin"), changeStatus);

export default router;