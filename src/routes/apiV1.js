const express = require("express");

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");
const authRouter = require("./auth/auth.router");

const apiV1 = express.Router();

// Routers
apiV1.use("/planets", planetsRouter);
apiV1.use("/launches", launchesRouter);
apiV1.use("/auth", authRouter);

module.exports = apiV1;
