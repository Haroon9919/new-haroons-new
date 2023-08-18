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

describe("user-errors", () => {
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

describe("/api/articles/:articles_id", () => {
  test("GET 200 AND return the correct article object with the correct properties and status 200", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
});

test("404 - responds with Not Found for non-existent id", () => {
  return request(app)
    .get("/api/articles/12334404")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not Found");
    });
});

test("400 - responds with error when id is not a number", () => {
  return request(app)
    .get("/api/articles/bosh")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid Input");
    });
});

describe("GET api/articles", () => {
  test("200 - repsonds with an article with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("counter");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("should return in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        for (let i = 1; i < body.length; i++) {
          const firstDate = new Date(body[i - 1].created_at);
          const secondDate = new Date(body[i].created_at);
          expect(secondDate.getTime()).toBeLessThanOrEqual(firstDate.getTime());
        }
      });
  });
});
