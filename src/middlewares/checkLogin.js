function checkLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      message: "You are not logged in",
    });
  }
  next();
}

module.exports = { checkLogin };
