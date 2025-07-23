const http = require("http");

const app = require("./app");
const { loadHabitablePlanets } = require("./models/planets/planets.model");
const { connectToMongoDB } = require("./services/mongodb");
const { loadSpaceXLaunches } = require("./models/launches/launches.model");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
  await connectToMongoDB();
  await loadHabitablePlanets();
  await loadSpaceXLaunches();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}..`);
  });
}
startServer();
