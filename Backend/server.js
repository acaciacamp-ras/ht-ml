import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { apiLimiter, authLimiter, adminLimiter } from "./middleware/rateLimiter.js";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js"; // Import authMiddleware
import { requestLogger } from "./utils/logger.js";
import { errorLogger } from "./utils/logger.js";
import { infoLogger } from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js"; // Import errorHandler

infoLogger("Server started on port 3000");


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware setup
app.use(express.json());
app.use(morgan("combined")); // Logging
app.use(helmet()); // Security headers
app.use(cors()); // Allow all origins (customize as needed)
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set views directory
app.use(requestLogger); // Log all HTTP requests
app.use(errorLogger); // Log all errors

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use("/register", limiter);
app.use("/login", limiter);

// Apply rate limiters
app.use("/api", apiLimiter); // General API endpoints
app.use("/auth", authLimiter); // Authentication endpoints
app.use("/admin", adminLimiter); // Admin endpoints

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/admin", adminRoutes); // Admin routes
app.use("/api", userRoutes);

// Protected Route Example
app.get("/protected", authMiddleware, (req, res) => {
  res.send("This is a protected route, accessible only with a valid token.");
});

// Route to render the admin dashboard
app.get("/admin/dashboard", authMiddleware, (req, res) => {
  // Render the admin dashboard
  res.render("adminDashboard", { users: [] }); // Pass user data if needed
});

// Error Handling Middleware (must be the last middleware)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));