require("dotenv").config();

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const port = Number(process.env.PORT) || 3003;

const ClientID = process.env.CLIENT_ID;
const ClientSecret = process.env.CLIENT_SECRET;

if (!ClientID || !ClientSecret) {
  throw new Error("CLIENT_ID and CLIENT_SECRET must be set in .env");
}

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: ClientID,
      clientSecret: ClientSecret,
      callbackURL: "http://localhost:3003/callback",
    },
    (accessToken, refreshToken, profile, next) => {
      next(null, profile);
    },
  ),
);

app.get("/", (req, res) => {
  res.send(`<a href="/login">Login with google</a>`);
});

app.get("/login", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    session: false,
  }),
  (req, res) => {
    res.send(`Hi ${req.user.displayName}`);
  },
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
