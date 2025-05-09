const express = require("express");
const cors = require("cors");
const path = require("path");

const planetsRouter = require("./routes/planets/planets.router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:8001",
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "build")));

app.use("/planets", planetsRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

module.exports = app;
