const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const request = require("supertest");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("app testing", () => {
  describe("/api/topics", () => {
    test("GET 200: should respond with an array of topics object that have slug and description properties and status 200", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topics = response.body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics.length).toBe(3);
          return topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });
});

describe("errors", () => {
  test("GET 404: should return an error for a non-existant path", () => {
    return request(app).get("/api/toepics").expect(404);
  });
});

describe("/api endpoints", () => {
  test("GET 200 AND return a JSON object with the endpoints each of which has the correct properties with status 200", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const responseBody = JSON.parse(response.text);
        const endPoints = Object.keys(responseBody);
        for (i = 1; i < endPoints.length; i++) {
          expect(responseBody[endPoints[i]]).toHaveProperty("description");
          expect(responseBody[endPoints[i]]).toHaveProperty("queries");
          expect(responseBody[endPoints[i]]).toHaveProperty("exampleResponse");
        }
      });
  });
});
