const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const apiV1 = require("./routes/apiV1");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(morgan("combined"));

app.use("/v1", apiV1);

// Serve frontend
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

module.exports = app;
