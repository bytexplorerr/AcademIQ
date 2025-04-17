import express from "express";
import passport from "../middlewares/googleAuth.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";
import { GoogleOAuthMailService } from "../services/mailService.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// ---------------------------
// Google OAuth Redirect Flow
// ---------------------------

// Redirect to Google (with role passed as state)
router.get("/google", (req, res, next) => {

  let { role } = req.query;
  const state = role;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
  })(req, res, next);
});

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { user, token } = req.user;
    res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
  }
);

// ---------------------------
// Token-based Google Login (from frontend SDK)
// ---------------------------
router.post("/google-login", async (req, res) => {
  try {
    const { credential } = req.body;
    let { role } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await userModel.findOne({ email: payload.email });

    if (!user) {

        if(role !== 'instructor') {
            role = 'student';
        }

      user = await userModel.create({
        name: `${payload.given_name} ${payload.family_name || ''}`,
        email: payload.email,
        googleId: payload.sub,
        role
      });

      // Send welcome mail
      GoogleOAuthMailService({
        emailID: payload.email,
        userName: payload.given_name,
      });
    }

    const token = jwt.sign({_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during Google login: ", error);
    res.status(400).json({ message: "Invalid Token" });
  }
});

export default router;
