const express = require("express");
const passport = require("passport");
var googleStrategy = require("passport-google-oauth20").Strategy;

const { verifyLogin } = require("./auth.controller");

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://localhost:8000/auth/google/callback",
    },
    verifyLogin,
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

const authRouter = express.Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] }),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
    session: true,
  }),
);

module.exports = authRouter;
