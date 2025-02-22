/**
 * Centralized error handling middleware.
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const errorHandler = (err, req, res) => {
  console.error(err.stack); // Log the error stack trace for debugging

  // Default error message and status code
  let message = "Something went wrong!";
  let statusCode = 500;

  // Handle specific error types
  if (err.name === "ValidationError") {
    // Handle validation errors (e.g., from express-validator)
    statusCode = 400;
    message = err.message || "Validation failed. Please check your input.";
  } else if (err.name === "UnauthorizedError") {
    // Handle unauthorized errors (e.g., invalid token)
    statusCode = 401;
    message = "Unauthorized. Please log in.";
  } else if (err.name === "NotFoundError") {
    // Handle not found errors (e.g., user not found)
    statusCode = 404;
    message = err.message || "Resource not found.";
  } else if (err.name === "ConflictError") {
    // Handle conflict errors (e.g., duplicate email)
    statusCode = 409;
    message = err.message || "Conflict occurred. Please try again.";
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === "development" ? err.stack : {}, // Include stack trace in development only
  });
};