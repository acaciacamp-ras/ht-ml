import db from "../config/dbconfig.js";

// Get all users
export const getAllUsers = (req, res) => {
    db.query("SELECT id, name, email, role FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Delete a user
export const deleteUser = (req, res) => {
    const userId = req.params.id;
    db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User deleted successfully" });
    });
};
