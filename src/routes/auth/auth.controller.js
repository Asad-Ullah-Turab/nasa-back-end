function verifyLogin(accessToken, refreshToken, profile, cb) {
  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);
  console.log("Profile:", profile);
  return cb(null, profile);
}

module.exports = { verifyLogin };
