import db from "../config/dbconfig.js";


/**
 * Fetch all users from the database.
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

/**
 * Fetch all bookings/reservations for a specific user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getUserBookings = async (req, res) => {
  const userId = req.params.id;

  try {
    const query = `
      SELECT bookings.id, resorts.name AS resortName, bookings.checkInDate, bookings.checkOutDate, bookings.status
      FROM bookings
      JOIN resorts ON bookings.resortId = resorts.id
      WHERE bookings.userId = ?
    `;
    const [results] = await db.query(query, [userId]);

    // Return the list of bookings
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update a user's role (e.g., promote to admin).
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  try {
    const query = "UPDATE users SET role = ? WHERE id = ?";
    const [results] = await db.query(query, [role, userId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success message
    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};