import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbconfig from "../config/dbconfig.js";
import express from "express";


const router = express.Router();

// Admin Login
router.post("/admin/login", (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ? AND role = 'admin'", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, results[0].password);
        if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: results[0].id, role: results[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
});


const JWT_SECRET = "03Ce9dvF5XnAjehdqapklJvFAKYM-8Par3sV8qMrbmg"; // Use .env in production

export default (app) => {
  // User Registration Endpoint
  app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        db.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (err, results) => {
            if (err) {
              console.error("Error creating user:", err);
              return res.status(500).json({ message: "Internal Server Error" });
            }
            res.status(201).json({ id: results.insertId, username, email });
          }
        );
      } catch (hashError) {
        console.error("Error hashing password:", hashError);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  });

  // User Login Endpoint
  app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      // Compare password with hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT
      const payload = {
        id: user.id,
        name: user.username,
        email: user.email,
      };

      const token = jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });

      res.status(200).json({ token, user: payload });
    });
  });
};
