import express from "express";
import { registerUser, loginUser, refreshToken } from "../controllers/authController.js";
import { validateRegistration, validateLogin } from "../utils/validators.js";

const router = express.Router();

// User Registration
router.post("/register", validateRegistration, registerUser);

// User Login
router.post("/login", validateLogin, loginUser);

// Refresh Token
router.post("/refresh-token", refreshToken);

export default router;