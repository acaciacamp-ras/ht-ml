import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream for request logs
const requestLogStream = fs.createWriteStream(path.join(logsDir, "requests.log"), {
  flags: "a", // Append to the file
});

// Create a write stream for error logs
const errorLogStream = fs.createWriteStream(path.join(logsDir, "errors.log"), {
  flags: "a", // Append to the file
});

// HTTP request logger middleware
export const requestLogger = morgan("combined", {
  stream: requestLogStream, // Log requests to a file
});

// Custom error logger
export const errorLogger = (err, req, res, next) => {
  const errorMessage = `${new Date().toISOString()} - ${err.stack || err.message}\n`;
  errorLogStream.write(errorMessage); // Log errors to a file
  console.error(errorMessage); // Also log errors to the console
  next(err); // Pass the error to the next middleware
};

// Custom info logger
export const infoLogger = (message) => {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(path.join(logsDir, "info.log"), logMessage); // Log info messages to a file
  console.log(logMessage); // Also log info messages to the console
};