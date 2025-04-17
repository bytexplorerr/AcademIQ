import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, // Pass request to callback to extract role
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let role = req.query.state;

        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          if(role !== 'instructor') {
            role = 'student';
          }
          user = await userModel.create({
            name: `${profile.name.givenName} ${profile.name.familyName || ''}`,
            email: profile.emails[0].value,
            googleId: profile.id,
            role,
          });
        }

        const token = jwt.sign({_id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.token);
});

passport.deserializeUser((token, done) => {
  done(null, token);
});

export default passport;
