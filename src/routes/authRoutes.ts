import { logger } from "../config/logger";
import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { login, logout, register } from "../controllers/authController";
import { IUser } from "../types";
import {
  authMiddleware,
  loginValidationRules,
  registerValidationRules,
  validate,
} from "../middlewares";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
router.post("/register", registerValidationRules, validate, register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/login",
  loginValidationRules,
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (error: any, user: IUser, info: any) => {
        if (error) return next(error);
        if (!user) {
          return res.status(401).json({ message: info.message });
        }

        req.logIn(user, { session: false }, (err) => {
          if (err) {
            return next(err);
          }
          logger.info(`User logged in successfully: ${user.email}`);

          return login(req, res);
        });
      }
    )(req, res, next);
  }
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.get("/logout", authMiddleware, logout);

export default router;
