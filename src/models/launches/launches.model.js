const launches = require("./launches.mongo");
const planets = require("../planets/planets.mongo");
const axios = require("axios");

const STARTING_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4";

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", // name
  rocket: "Explorer IS1", // rocket.name
  launchDate: new Date("December 27, 2030"), // date_unix
  target: "Kepler-442 b", // not applicable
  customer: ["ZTM", "NASA"],
  upcoming: true, // upcoming
  success: true, // success
};

async function loadSpaceXLaunches() {
  const response = await axios.post(`${SPACEX_API_URL}/launches/query`, {
    query: {},
    options: {
      pagination: true,
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

  const launchDocs = response.data.docs;

  const launchesToSave = launchDocs.map((launchDoc) => {
    return {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: new Date(launchDoc.date_unix),
      target: "Kepler-442 b",
      customers: launchDoc.payloads.map((payload) => {
        return payload.customers;
      }),
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
    };
  });
  launchesToSave.forEach((launch) => {
    launch.customers = launch.customers.flat(2);
  });
}

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
  loadSpaceXLaunches,
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
};
