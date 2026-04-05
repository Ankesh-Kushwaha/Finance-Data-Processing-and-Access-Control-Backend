import express from "express";
import { createRecord, getRecords, getSingleRecord, updateRecord, deleteRecord,searchRecords } from '../controllers/finance.controller.js';
import { auth } from "../middlewares/auth.middleware.js";
import { excessControl } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(auth);
router.post('/create',excessControl("admin"),createRecord);
router.get('/get-all-record',excessControl("admin","viewer","analyst"), getRecords);
router.get('/get-single-record/:id',excessControl("admin","viewer","analyst"), getSingleRecord);
router.put('/update-record/:id',excessControl("admin"), updateRecord);
router.delete('/delete-record/:id', excessControl("admin"), deleteRecord);
router.get('/search', excessControl("admin", "viewer", "analyst"), searchRecords);

export default router;
