import { userRegister, userLogin } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();
router.post("/register", userRegister);
router.post("/login", userLogin);

export default router;