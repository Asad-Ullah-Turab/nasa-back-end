const launches = require("./launches.mongo");
const planets = require("../planets/planets.mongo");

const STARTING_FLIGHT_NUMBER = 100;

async function existsLaunchWithId(launchId) {
  const response = await launches.findOne({
    flightNumber: launchId,
  });
  return response;
}

async function getAllLaunches() {
  const response = await launches.find({}, "-__v -_id");
  return response;
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error(
      "Planet name is incorrect. Only available planet names are allowed",
    );
  }

  let latestFlightNumber = await getLatestFlightNumber();
  const completeLaunch = Object.assign(launch, {
    flightNumber: ++latestFlightNumber,
    customer: ["ZTM", "Asad", "NASA"],
    upcoming: true,
    success: true,
  });
  launches.create(completeLaunch);
  return completeLaunch;
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return STARTING_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function abortLaunch(launchId) {
  await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    },
  );
  const abortedLaunch = launches.findOne(
    { flightNumber: launchId },
    "-__v -_id",
  );
  return abortedLaunch;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
};
