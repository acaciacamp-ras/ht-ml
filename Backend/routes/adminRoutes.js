import express from "express";
import {
  getAllUsers,
  deleteUser,
  getUserBookings,
  updateUserRole,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch all users
router.get("/users", authMiddleware, getAllUsers);

// Delete a user by ID
router.delete("/users/:id", authMiddleware, deleteUser);

// Fetch all bookings for a specific user
router.get("/users/:id/bookings", authMiddleware, getUserBookings);

// Update a user's role
router.put("/users/:id/role", authMiddleware, updateUserRole);

export default router;