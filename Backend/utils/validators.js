import { body } from "express-validator";

/**
 * Validation rules for user registration.
 * - Email must be a valid email address.
 * - Password must be at least 8 characters long and contain:
 *   - At least one uppercase letter
 *   - At least one lowercase letter
 *   - At least one digit
 *   - At least one special character (!@#$%^&*)
 */
export const validateRegistration = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)."
    ),
];

/**
 * Validation rules for user login.
 * - Email must be a valid email address.
 * - Password must not be empty.
 */
export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];
