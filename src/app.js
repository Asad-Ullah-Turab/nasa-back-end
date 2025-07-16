const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:8001",
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(morgan("combined"));

// Routers
app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

// Serve frontend
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

module.exports = app;
