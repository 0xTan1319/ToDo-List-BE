import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const registerValidationRules = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidationRules = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password").exists().withMessage("Password is required"),
];

export const validate = (
  req: Request,
  _res: Response,
  next: NextFunction
): any => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error("Validation failed");
    error.status = 400;
    error.errors = errors.array();
    throw error;
  }
  next();
};
