import { Model, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

interface IUserModel extends Model<IUser> {
  findOneOrCreatedFromGoogle(profile: any): Promise<IUser>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  verification: { type: String },
  phoneNumber: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  isActive: { type: Boolean, required: true, default: false },
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password!, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.hash(enteredPassword, this.password);
};

userSchema.statics.findOneOrCreatedFromGoogle = async function (profile: any) {
  const { id, emails } = profile;

  let user =
    (await this.findOne({ googleId: id })) ||
    (await this.findOne({ email: emails[0].value }));

  if (!user) {
    user = new this({ googleId: id, email: emails[0].value });

    await user.save;
  }

  return user;
};

const User = model<IUser, IUserModel>("User", userSchema);

export default User;
