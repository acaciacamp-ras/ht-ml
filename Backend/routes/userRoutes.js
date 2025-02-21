import db from "../config/dbconfig.js";

// Create a new user
module.exports = (app) => {
  app.post("/users", (req, res) => {
    const { username, email, password } = req.body;
    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(query, [username, email, password], (err, results) => {
      if (err) {
        console.error("Error creating user:", err);
        res.status(500).send("Error creating user");
        return;
      }
      res.status(201).send({ id: results.insertId, username, email });
    });
  });

  // Get all users
  app.get("/users", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users");
        return;
      }
      res.status(200).send(results);
    });
  });

  // Get a user by ID
  app.get("/users/:id", (req, res) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Error fetching user");
        return;
      }
      if (results.length === 0) {
        res.status(404).send("User not found");
        return;
      }
      res.status(200).send(results[0]);
    });
  });

  // Update a user by ID
  app.put("/users/:id", (req, res) => {
    const { username, email, password } = req.body;
    const query =
      "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
    db.query(
      query,
      [username, email, password, req.params.id],
      (err, results) => {
        if (err) {
          console.error("Error updating user:", err);
          res.status(500).send("Error updating user");
          return;
        }
        if (results.affectedRows === 0) {
          res.status(404).send("User not found");
          return;
        }
        res.status(200).send({ id: req.params.id, username, email });
      }
    );
  });

  // Delete a user by ID
  app.delete("/users/:id", (req, res) => {
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Error deleting user");
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send("User not found");
        return;
      }
      res.status(200).send("User deleted successfully");
    });
  });
};
