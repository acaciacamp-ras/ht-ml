import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateUserCreation, validateUserUpdate } from "../utils/validators.js";

const router = express.Router();

// Create a new user
router.post("/users", validateUserCreation, createUser);

// Get all users (protected route)
router.get("/users", authMiddleware, getAllUsers);

// Get a user by ID (protected route)
router.get("/users/:id", authMiddleware, getUserById);

// Update a user by ID (protected route)
router.put("/users/:id", authMiddleware, validateUserUpdate, updateUser);

// Delete a user by ID (protected route)
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;