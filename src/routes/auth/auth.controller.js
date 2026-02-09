async function httpGoogleLogin(req, res) {
  res.status(200).json({
    message: "Login successful",
  });
}

module.exports = { httpGoogleLogin };
