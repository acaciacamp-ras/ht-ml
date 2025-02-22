import db from "../config/dbconfig.js";
import bcrypt from "bcrypt";

/**
 * Create a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const [results] = await db.query(query, [username, email, hashedPassword]);

    // Return the created user's details (excluding the password)
    res.status(201).json({ id: results.insertId, username, email });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Fetch all users.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getAllUsers = async (req, res) => {
  try {
    const query = "SELECT id, username, email, role FROM users";
    const [results] = await db.query(query);

    // Return the list of users
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Fetch a user by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const query = "SELECT id, username, email, role FROM users WHERE id = ?";
    const [results] = await db.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's details (excluding the password)
    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update a user by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  try {
    let hashedPassword;
    if (password) {
      // Hash the new password if provided
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const query = `
      UPDATE users
      SET username = ?, email = ?, ${password ? "password = ?" : ""}
      WHERE id = ?
    `;
    const params = password
      ? [username, email, hashedPassword, userId]
      : [username, email, userId];

    const [results] = await db.query(query, params);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user's details (excluding the password)
    res.status(200).json({ id: userId, username, email });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete a user by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const query = "DELETE FROM users WHERE id = ?";
    const [results] = await db.query(query, [userId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};