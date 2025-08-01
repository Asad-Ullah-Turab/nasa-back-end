const {
  getAllLaunches,
  abortLaunch,
  existsLaunchWithId,
  scheduleNewLaunch,
} = require("../../models/launches/launches.model");
const getPagination = require("../../services/pagination");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  try {
    const result = await scheduleNewLaunch(launch);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const launchExists = await existsLaunchWithId(launchId);
  if (!launchExists) {
    return res.status(404).json({
      error: `Launch with ID: ${launchId} not found`,
    });
  }
  const abortedLaunch = await abortLaunch(launchId);
  return res.status(200).json(abortedLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
