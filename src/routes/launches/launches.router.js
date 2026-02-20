const express = require("express");

const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controller");
const { checkLogin } = require("../../middlewares/checkLogin");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", checkLogin, httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
