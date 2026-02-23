const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
const cookieSession = require("cookie-session");

const apiV1 = require("./routes/apiV1");

const app = express();

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(morgan("combined"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET_KEY_01, process.env.COOKIE_SECRET_KEY_02],
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", apiV1);

// Serve frontend
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

module.exports = app;
