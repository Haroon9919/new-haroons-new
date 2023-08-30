const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const request = require("supertest");
const { toBeSortedBy } = require("jest-extended");

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
  test("200 - responds with articles with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_counter");
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("should return articles in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        for (let i = 1; i < body.length; i++) {
          const firstDate = new Date(articles[i - 1].created_at);
          const secondDate = new Date(articles[i].created_at);
          expect(secondDate.getTime()).toBeLessThanOrEqual(firstDate.getTime());
        }
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("200 - responds with an array of comment object(s) with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("200 - comments should be sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body;
        for (let i = 0; i < comments.length - 1; i++) {
          const currentComment = new Date(comments[i].created_at);
          const nextComment = new Date(comments[i + 1].created_at);
          expect(currentComment.getTime()).toBeGreaterThanOrEqual(
            nextComment.getTime()
          );
        }
      });
  });
  test('status:404, responds with an error message when passed a valid ID that doesnt exist', () => {
    return request(app)
      .get('/api/articles/9000000/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment Doesnt Exist');
      });
  });
  test('status 400, responds with an error message when passed an invalid ID type', ()=>{
    return request(app)
    .get('/api/articles/invalidinput/comments')
    .expect(400)
    .then(({body})=>{
        expect(body.msg).toBe("Invalid Input")
    });
  });
 
});


describe("POST /api/articles/:article_id/comments", () => {
  test("Status 201 - responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .set("Content-Type", "application/json")
      .send({ username: "butter_bridge", comment: "This morning, I showered for nine minutes." })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty('comment_id');
        expect(comment).toHaveProperty('votes');
        expect(comment).toHaveProperty('created_at');
        expect(comment).toHaveProperty('author');
        expect(comment).toHaveProperty('body');
        expect(comment).toHaveProperty('article_id');
        
      })
      
      });
      test('status:404, responds with an error message when passed a valid ID that doesnt exist', () => {
        return request(app)
          .get('/api/articles/9000000/comments')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment Doesnt Exist');
          });
  })


test('status:400, responds with an error message when passed a username that doesnt exist', () => {
  return request(app)
    .get('/api/articles/9000000/comments')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Comment Doesnt Exist');
    })
  })

    test("Non-existent username should not be able to post a comment", async () => {
      const nonExistentUsername = "nonexistent_user";
      const response = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: nonExistentUsername, body: "Some comment" });
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        msg: "Invalid input"

      })})
      test("Empty body should not be able to post a comment", async () => {
        
        const response = await request(app)
          .post("/api/articles/1/comments")
          .send({ username: 'butter_bridge', body: "" });
    
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          msg: "Invalid input"
  
        })})
        test("empty username field should not be able to post a comment", async () => {
        
          const response = await request(app)
            .post("/api/articles/1/comments")
            .send({ username: '', body: "bohshsshshshsh" });
      
          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            msg: "Invalid input"})})})
    
    