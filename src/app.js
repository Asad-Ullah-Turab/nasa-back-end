const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

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
  session({
    name: "session",
    secret: [
      process.env.COOKIE_SECRET_KEY_01,
      process.env.COOKIE_SECRET_KEY_02,
    ],
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, // 1 day
    }),
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
