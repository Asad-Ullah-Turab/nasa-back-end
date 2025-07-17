const request = require("supertest");

const app = require("../../app");

describe("Tests GET on /launches", () => {
  test("should return 200 status code", async () => {
    await request(app).get("/launches").expect(200);
  });
});

describe("Tests POST on /launches", () => {
  const completeLaunchData = {
    mission: "Test Mission",
    rocket: "Ascapelo 1",
    target: "Kerban",
    launchDate: "January 4, 2028",
  };
  const launchDataWithoutDate = {
    mission: "Test Mission",
    rocket: "Ascapelo 1",
    target: "Kerban",
  };
  const launchDataWithInvalidDate = {
    mission: "Test Mission 3",
    rocket: "Ascapelo 3",
    target: "Jool",
    launchDate: "Hello I am a date :)",
  };
  test("should return 201 status code", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("should return 400 status code when missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("should return 400 status code when date is invalid", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});
