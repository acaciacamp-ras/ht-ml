import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import db from "../config/dbconfig.js";

const router = express.Router();

// Render Admin Dashboard
router.get("/dashboard", authMiddleware, (req, res) => {
    db.query("SELECT id, name, email, role FROM users", (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.render("admin-dashboard", { users });
    });
});

export default router;
