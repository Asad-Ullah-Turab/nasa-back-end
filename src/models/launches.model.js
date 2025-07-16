const launches = new Map();

let latestFlightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("2030-08-15T00:00:00Z"),
  destination: "Kepler-442 b",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  const completeLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customer: ["ZTM", "Asad", "NASA"],
    upcoming: true,
    success: true,
  });
  launches.set(completeLaunch.flightNumber, completeLaunch);
  return completeLaunch;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
};
