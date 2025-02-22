import db from "../config/dbconfig.js";
import bcrypt from "bcrypt";

/**
 * Create a new user in the database.
 * @param {string} username - The user's username.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - The created user's details (excluding the password).
 */
export const createUser = async (username, email, password) => {
  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const [results] = await db.query(query, [username, email, hashedPassword]);

    // Return the created user's details (excluding the password)
    return { id: results.insertId, username, email };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

/**
 * Fetch a user by their ID.
 * @param {number} id - The user's ID.
 * @returns {Promise<Object>} - The user's details (excluding the password).
 */
export const getUserById = async (id) => {
  try {
    const query = "SELECT id, username, email FROM users WHERE id = ?";
    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      throw new Error("User not found");
    }

    return results[0];
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user");
  }
};

/**
 * Fetch all users from the database.
 * @returns {Promise<Array>} - A list of all users (excluding passwords).
 */
export const getAllUsers = async () => {
  try {
    const query = "SELECT id, username, email FROM users";
    const [results] = await db.query(query);
    return results;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to fetch users");
  }
};

/**
 * Update a user's details in the database.
 * @param {number} id - The user's ID.
 * @param {string} username - The updated username.
 * @param {string} email - The updated email.
 * @param {string} password - The updated password.
 * @returns {Promise<Object>} - The updated user's details (excluding the password).
 */
export const updateUser = async (id, username, email, password) => {
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
      ? [username, email, hashedPassword, id]
      : [username, email, id];

    const [results] = await db.query(query, params);

    if (results.affectedRows === 0) {
      throw new Error("User not found");
    }

    // Return the updated user's details (excluding the password)
    return { id, username, email };
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

/**
 * Delete a user from the database.
 * @param {number} id - The user's ID.
 * @returns {Promise<boolean>} - True if the user was deleted, false otherwise.
 */
export const deleteUser = async (id) => {
  try {
    const query = "DELETE FROM users WHERE id = ?";
    const [results] = await db.query(query, [id]);

    if (results.affectedRows === 0) {
      throw new Error("User not found");
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};