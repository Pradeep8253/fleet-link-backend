import { Router } from "express";
import { forgotPassword, getUser, login, logout, register, resetPassword } from "../controllers/authUserControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get", authMiddleware, getUser);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;
