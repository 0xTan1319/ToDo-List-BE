import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { logger } from "./logger";
import User from "../models/User";

export const passportConfig = () => {
  passport.use(
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            logger.warn(
              `Login attemp faild: No user found with email: ${email}`
            );
            return done(null, false, {
              message: `No user with the email: ${email}`,
            });
          }

          const isMatch = await user.comparePassword(password);

          if (!isMatch) {
            logger.warn(
              `Login attempt faild: Incorrect password for email ${email}`
            );
            return done(null, false, { message: "Incorrect password" });
          }

          logger.info(`User authenticated via local strategy: ${email}`);
          return done(null, user);
        } catch (error: any) {
          logger.error(`Error during local authentication: ${error.message}`);
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
