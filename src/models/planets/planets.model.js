const fs = require("fs");
const path = require("path");
const planets = require("./planets.mongo");

const { parse } = require("csv-parse");

const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

function loadHabitablePlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "..", "data", "keplet_data.csv"),
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        }),
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await addPlanet(data);
        }
      })
      .on("err", (err) => {
        console.log(err);
        reject();
      })
      .on("end", async () => {
        const planetsCount = (await getAllPlanets()).length;
        console.log(`${planetsCount} habitable planets found`);
        resolve();
      });
  });
}

async function addPlanet(planet) {
  await planets.updateOne(
    {
      keplerName: planet.kepler_name,
    },
    {
      keplerName: planet.kepler_name,
    },
    {
      upsert: true,
    },
  );
}

async function getAllPlanets() {
  return planets.find({});
}

module.exports = {
  getAllPlanets,
  loadHabitablePlanets,
};
