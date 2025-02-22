import jwt from "jsonwebtoken";
import { JWT_SECRET } from "dotenv";

/**
 * Authentication middleware to verify JWT tokens.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Define 'user' here
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};
  // Check if the header is in the format "Bearer <token>"
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  if (!token) {
    return res.status(401).json({ message: "Access denied. Invalid token format." });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Attach the user payload to the request object

    // Optional: Check if the user has the required role (e.g., admin)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. You do not have the required permissions." });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(400).json({ message: "Invalid token. Please log in again." });
  }
;