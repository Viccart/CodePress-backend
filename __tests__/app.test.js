const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("get 200 return all topics", () => {
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
        expect(msg).toBe("Endpoint does not exist");
      });
  });
});

describe("GET 200 /api/articles/:article_id", () => {
  test("get 200 return article by article id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(Object.keys(article).length).toBe(9);
        expect(article).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  test("STATUS 400 responds with a 400 and correct message for an invalid article id", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid id");
      });
  });
  test("STATUS 404 responds with a 404 and correct message for a valid article that does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article id does not exist");
      });
  });
});
describe("GET /api/articles", () => {
  test("get 200 return all articles including comment count sorted as default by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSorted({ key: "created_at", descending: true });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("STATUS 404 incorrect endpoint", () => {
    return request(app)
      .get("/api/no-articles")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Endpoint does not exist");
      });
  });
  test("200: accepts a topic query which responds with only those topics", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("200: responds with an empty array for topic query which exists but contains no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([]);
      });
  });
  test("404: responds with not found for topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=420")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic does not exist");
      });
  });
  test("200: accepts a sort by query which sorts by that column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const articlesCopy = [...articles];
        const sortedArticles = articlesCopy.sort((articleA, articleB) => {
          if (articleA.title < articleB.title) return 1;
          if (articleA.title > articleB.title) return -1;
          return 0;
        });
        expect(articles).toEqual(sortedArticles);
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
      });
  });
  test("200: accepts an order query which returns in ascending or descending order (defaults to desc)", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const articlesCopy = [...articles];
        const sortedArticles = articlesCopy.sort((articleA, articleB) => {
          if (articleA.title > articleB.title) return 1;
          if (articleA.title < articleB.title) return -1;
          return 0;
        });
        expect(articles).toEqual(sortedArticles);
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
      });
  });
  test("400: returns a 400 bad request when sorting by cateogry that doesn't exist", () => {
    return request(app)
      .get("/api/articles?sort_by=danger")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Sort Query");
      });
  });
  test("400: returns a 400 bad request when ordering by anything other than asc or desc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=danger")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Order Query");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("get 200 return all comments from an article by article id where the article does have comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        expect(comments).toBeSorted({ key: "created_at", descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("get 200 returns an empty array for an article that does not have comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toEqual([]);
      });
  });
  test("STATUS 400 responds with a 400 and correct message for an invalid article id", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid id");
      });
  });
  test("STATUS 404 responds with a 404 and correct message for a valid article that does not exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article id does not exist");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("post 201 update articles to include the new comment and return that comment", () => {
    const comment = {
      body: "Testing, testing, 123",
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(comment)
      .expect(201)
      .then((response) => {
        const { body } = response;
        expect(body).toHaveProperty("comment_id");
        expect(Object.keys(body).length).toBe(6);
        expect(body).toMatchObject({
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });
  test("STATUS 400 responds with a 400 and correct message for an invalid article id", () => {
    const comment = {
      body: "Testing, testing, 123",
      username: "icellusedkars",
    };

    return request(app)
      .post("/api/articles/hello/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid id");
      });
  });
  test("STATUS 404 responds with a 404 and correct message for a valid article that does not exist", () => {
    const comment = {
      body: "Testing, testing, 123",
      username: "icellusedkars",
    };

    return request(app)
      .post("/api/articles/999999/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article id does not exist");
      });
  });
  test("STATUS 404 responds with a 404 and correct message for a valid article with username that does not exist", () => {
    const comment = {
      body: "Testing, testing, 123",
      username: "broken",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Username does not exist");
      });
  });
  test("STATUS 201 ignores unnecessary properties", () => {
    const comment = {
      body: "Testing, testing, 123",
      username: "icellusedkars",
      votes: 50,
    };

    return request(app)
      .post("/api/articles/9/comments")
      .send(comment)
      .expect(201)
      .then((response) => {
        const { body } = response;
        expect(body).toHaveProperty("comment_id");
        expect(Object.keys(body).length).toBe(6);
        expect(body).toMatchObject({
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });
  test("STATUS 400 responds with a 400 and correct message for missing required field(s)", () => {
    const comment = {
      body: "",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Missing required field(s)");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("patch 200 responds with the updated article", () => {
    const incVotes = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/3")
      .send(incVotes)
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body).length).toBe(1);
        expect(Object.keys(body.article).length).toBe(8);
        expect(body.article.votes).toBe(50);
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("STATUS 400 responds with a 400 and correct message for an invalid article id", () => {
    const incVotes = { inc_votes: 50 };

    return request(app)
      .patch("/api/articles/hello")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid id");
      });
  });
  test("STATUS 404 responds with a 404 and correct message for a valid article that does not exist", () => {
    const incVotes = { inc_votes: 50 };

    return request(app)
      .patch("/api/articles/999999")
      .send(incVotes)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article id does not exist");
      });
  });
  test("STATUS 400 responds with a 400 and correct message where the votes are not a number", () => {
    const incVotes = { inc_votes: "ten" };

    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid votes input");
      });
  });
  test("STATUS 400 responds with a 400 and correct message where the body has a missing property {}", () => {
    const incVotes = {};

    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Missing input property");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("status 204: responds with an empty response", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204);
  });
  test("status 400 and correct message for an invalid comment id", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid id");
      });
  });
  test("status 404 and correct message for a valid comment id that doesn't exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Comment id does not exist");
      });
  });
});

describe("GET /api/users", () => {
  test("get 200 return all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
