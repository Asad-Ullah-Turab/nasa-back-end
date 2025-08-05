const fs = require("fs");
const https = require("https");
const path = require("path");

const app = require("./app");
const { loadHabitablePlanets } = require("./models/planets/planets.model");
const { connectToMongoDB } = require("./services/mongodb");
const { loadSpaceXLaunches } = require("./models/launches/launches.model");

const PORT = process.env.PORT || 8000;

const options = {
  key: fs.readFileSync(path.join(__dirname, "..", "ssl", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "..", "ssl", "cert.pem")),
};
const server = https.createServer(options, app);

async function startServer() {
  await connectToMongoDB();
  await loadHabitablePlanets();
  await loadSpaceXLaunches();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}..`);
  });
}
startServer();
