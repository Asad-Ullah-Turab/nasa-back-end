const launches = require("./launches.mongo");
const planets = require("../planets/planets.mongo");
const axios = require("axios");

const STARTING_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4";

async function saveSpaceXLaunches(launchDocs) {
  for (const launchDoc of launchDocs) {
    const customers = launchDoc.payloads.flatMap(
      (payload) => payload.customers,
    );
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: new Date(launchDoc.date_unix),
      target: "Kepler-442 b",
      customers,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success === null ? true : launchDoc.success,
    };
    await addNewLaunch(launch);
  }
  console.log(`${launchDocs.length} SpaceX launches saved successfully`);
}

async function existsLaunch(filter) {
  return await launches.findOne(filter);
}

async function spaceXLaunchesExist() {
  const firstLaunch = await existsLaunch({
    flightNumber: 1,
    mission: "FalconSat",
  });
  return firstLaunch !== null;
}

async function loadSpaceXLaunches() {
  if (await spaceXLaunchesExist()) {
    console.log("SpaceX launches already present in the database");
    return;
  }
  const response = await axios.post(`${SPACEX_API_URL}/launches/query`, {
    query: {},
    options: {
      pagination: false,
      select: {
        flight_number: 1,
        name: 1,
        rocket: 1,
        date_unix: 1,
        upcoming: 1,
        success: 1,
      },
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading SpaceX launches data");
    throw new Error("Launch data download failed");
  }

  await saveSpaceXLaunches(response.data.docs);
}

async function existsLaunchWithId(launchId) {
  const response = await existsLaunch({
    flightNumber: launchId,
  });
  return response;
}

async function getAllLaunches() {
  const response = await launches.find({}, "-__v -_id");
  return response;
}

async function addNewLaunch(launch) {
  await launches.create(launch);
}

async function scheduleNewLaunch(launch) {
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
  await addNewLaunch(completeLaunch);
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
  loadSpaceXLaunches,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch,
};
