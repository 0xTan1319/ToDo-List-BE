import { NextFunction, Request, Response } from "express";
import ms from "ms";
import User from "../models/User";
import { logger } from "../config";
import { generateToken } from "../utils";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(
        `Signup attemp failed user already exists with email: ${email}`
      );
      return res.status(400).json({ message: "User already exists." });
    }

    const user = new User({ email, password });
    await user.save();

    logger.info(`New user created: ${email}`);
    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  if (req.user) {
    const token = generateToken(req.user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ms(process.env.TOKEN_EXPIRE!),
    });

    return res.status(201).json({ message: "Logged in successfully!" });
  }
};

export const logout = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token");

    logger.info("User logged out successfully.");
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    logger.error("Logout error: %o", error);
    next(error);
  }
};
