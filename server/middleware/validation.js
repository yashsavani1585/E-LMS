import { body, validationResult } from "express-validator";

// Validation rules for registration
export const validateRegistration = [
    body("userName").notEmpty().withMessage("Username is required"),
    body("userEmail").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

// Validation rules for login
export const validateLogin = [
    body("userEmail").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};