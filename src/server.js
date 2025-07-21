const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const { loadHabitablePlanets } = require("./models/planets/planets.model");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("MONGO_URL environment variable is not set");
}

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully.");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL, {});
  await loadHabitablePlanets();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}..`);
  });
}
startServer();
