import rateLimit from "express-rate-limit";
/**
 * Rate limiter for general API endpoints.
 * Limits each IP to 100 requests per 15 minutes.
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP. Please try again after 15 minutes.",
    headers: true, // Send rate limit headers in the response
  });
  
  /**
   * Rate limiter for authentication endpoints (e.g., login, register).
   * Limits each IP to 10 requests per 15 minutes.
   */
  export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many login attempts. Please try again after 15 minutes.",
    headers: true, // Send rate limit headers in the response
  });
  
  /**
   * Rate limiter for admin endpoints.
   * Limits each IP to 50 requests per 15 minutes.
   */
  export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: "Too many requests to admin endpoints. Please try again after 15 minutes.",
    headers: true, // Send rate limit headers in the response
  });