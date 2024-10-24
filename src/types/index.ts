import { Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  verification?: string;
  phoneNumber?: string;
  googleId?: string;
  isActive: boolean;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

interface ITask extends Document {
  name: string;
  isCompleted: boolean;
}

export type { IUser, ITask };
