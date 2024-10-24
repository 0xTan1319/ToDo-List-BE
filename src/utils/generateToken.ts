import jwt from "jsonwebtoken";

export const generateToken = (user: any) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.TOKEN_EXPIRE!,
  });
};
