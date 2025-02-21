import mysql from 'mysql';

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Mik123-@", // Consider using environment variables for security
  database: "htmlsite",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

export default db;
