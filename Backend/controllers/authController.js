import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createUser, getUserByEmail } from "../models/userModel.js";

dotenv.config(); // Load environment variables

/**
 * Register a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const results = await createUser(username, email, hashedPassword);

    // Return the created user's details (excluding the password)
    res.status(201).json({
      id: results.insertId,
      username,
      email,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Log in an existing user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch the user by email
    const results = await getUserByEmail(email);

    // Check if the user exists
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Refresh the access token using a refresh token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required." });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email }, // Minimal payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Return the new access token
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).json({ message: "Invalid refresh token." });
  }
};