const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("get 200", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("STATUS 404 incorrect endpoint", () => {
    return request(app)
      .get("/api/no-topics")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Sorry, this endpoint does not exist");
      });
  });
});

describe("GET 200 /api/articles/:article_id", () => {
  test("get 200", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(Object.keys(article).length).toBe(8);
        expect(article).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("STATUS 400 responds with a 400 and correct message for an invalid article", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Sorry, this is not a valid article id");
      });
  });
  test("STATUS 404 responds with a 404 and correct message for a valid article that does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Sorry, this article ID does not exist");
      });
  });
});
