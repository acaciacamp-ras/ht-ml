import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv"; // Corrected import statement
import db from "./config/dbconfig.js"; // Ensure dbconfig.js has `export default db;`
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbconfigPath = path.resolve(__dirname, "../config/dbconfig.js");
import dbconfig from dbconfigPath;

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET; // Use environment variables

// Middleware setup
app.use(express.json());
app.use(morgan("combined"));
app.use(helmet());
app.use(cors()); // Allow all origins (you can customize this)
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use("/register", limiter);
app.use("/login", limiter);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Attach user info to request object
    next();
  });
};
// Protected Route Example
app.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route, accessible only with a valid token.");
});
fetch("http://localhost:3000/profile", {
  method: "GET",
  headers: { Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` }
})
  .then(response => response.json())
  .then(data => console.log(data));



// User Registration with validation
app.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Error checking user:", err);
          return res.status(500).send("Internal Server Error");
        }
        if (results.length > 0) {
          return res.status(400).send("User already exists");
        }

        try {
          const hashedPassword = await bcrypt.hash(password, 10);

          db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword],
            (err, results) => {
              if (err) {
                console.error("Error creating user:", err);
                return res.status(500).send("Internal Server Error");
              }
              res.status(201).send({ id: results.insertId, username, email });
            }
          );
        } catch (hashError) {
          console.error("Error hashing password:", hashError);
          return res.status(500).send("Internal Server Error");
        }
      }
    );
  }
);

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).send("Internal Server Error");
    }
    
    if (results.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Invalid credentials");
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ accessToken, refreshToken });
  });
});

// Refresh Token javascript
app.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).send("Refresh token is required.");

  jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid refresh token.");

    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ accessToken: newAccessToken });
  });
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
      next();
  } catch (error) {
      res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;