const request = require("supertest");
require("dotenv").config();

const app = require("../../app");
const {
  connectToMongoDB,
  disconnectFromMongoDB,
} = require("../../services/mongodb");

describe("Tests Launches API", () => {
  beforeAll(async () => {
    await connectToMongoDB();
  });
  afterAll(async () => {
    await disconnectFromMongoDB();
  });

  describe("Tests GET on /launches", () => {
    test("should return 200 status code", async () => {
      await request(app).get("/v1/launches").expect(200);
    });
  });

  describe("Tests POST on /launches", () => {
    const completeLaunchData = {
      mission: "Test Mission",
      rocket: "Ascapelo 1",
      target: "Kepler-442 b",
      launchDate: "January 4, 2028",
    };
    const launchDataWithoutDate = {
      mission: "Test Mission",
      rocket: "Ascapelo 1",
      target: "Kepler-442 b",
    };
    const launchDataWithInvalidDate = {
      mission: "Test Mission 3",
      rocket: "Ascapelo 3",
      target: "Jool",
      launchDate: "Hello I am a date :)",
    };
    const launchDataWithInvalidPlanet = {
      mission: "Test Mission 3",
      rocket: "Ascapelo 3",
      target: "Jool",
      launchDate: "December 27, 2026",
    };

    test("should return 201 status code", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("should return 400 status code when missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("should return 400 status code when date is invalid", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });

    test("should return 400 status code when planet is invalid", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidPlanet)
        .expect(400);
      expect(response.body).toStrictEqual({
        error:
          "Planet name is incorrect. Only available planet names are allowed",
      });
    });
  });
});
