import mysql from "mysql";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Create a connection to the database
const db = mysql.createConnection(dbConfig);

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process if the connection fails
  }
  console.log("Connected to the database");
});

// Export the database connection
export default db;