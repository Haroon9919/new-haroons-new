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