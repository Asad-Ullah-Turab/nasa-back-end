const { launches } = require("../../models/launches.model");

function getAllLaunches(req, res) {
  // send map of launches as array
  return res.status(200).json(Array.from(launches.values()));
}

module.exports = {
  getAllLaunches,
};
