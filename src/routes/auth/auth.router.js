const express = require("express");

const { httpGoogleLogin } = require("./auth.controller");

const authRouter = express.Router();

authRouter.get("/google", httpGoogleLogin);

module.exports = authRouter;
