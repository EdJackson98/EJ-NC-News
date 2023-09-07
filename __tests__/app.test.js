const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpointsData = require("../endpoints.json");

const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../db/data/test-data/");

beforeEach(() => seed({ topicData, articleData, commentData, userData }));
afterAll(() => db.end());

describe("GET: /api/topics", () => {
  test("200: Responds with an array of topics with the correct keys", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
  test("404: Responds with an appropriate error when path request is not found", () => {
    return request(app)
      .get("/api/t0pics")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });
});

describe("/api", () => {
  test("should return an object containing all available endpoints", (done) => {
    request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.endpoints).toEqual(endpointsData);
        done();
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  test.only("200: Responds with an article object with the correct keys", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        console.log(response.body.article)
        expect(response.body.article).toHaveProperty(
          "author",
          "title",
          "article_id",
          "topic",
          "created_at",
          "votes",
          "article_img_url"
        );
      });
  });
  test("GET:404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(`Article ID not found`);
      });
  });
  test("200: Responds with an article with comment_count key", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toHaveProperty(
          "comment_count"
        );
        expect(Number(response.body.article.comment_count)).toBe(11)
    });
  });
  test("GET:400 sends an appropriate and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/article/:article_id/comments", () => {
  test("GET:200 sends an array of comments to the user by article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toEqual(expect.any(Array));
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            })
          );
        });
      });
  });
  test("GET:200 sends an empty array when there are no comments for the article_id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe("No comments found on article id: 2");
      });
  });
  test("GET:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No article found for article id: 999");
      });
  });
  test("GET:400 sends an appropriate error message when given an invalid ID", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("comments should return, ordered by created_at, ascendingly", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { ascendingly: true });
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 sends an array of article objects with the correct keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toEqual(expect.any(Array));
        expect(response.body.articles.length).toBe(13);
        expect(Object.keys(response.body.articles[0])).toEqual(
          expect.arrayContaining([
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "article_img_url",
            "comment_count",
          ])
        );
      });
  });
  test("Should return articles in created_at order, descendingly", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET:200 sends an array of article objects with the correct keys and topic filter", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toEqual(expect.any(Array));
        expect(response.body.articles.length).toBe(12);
        expect(Object.keys(response.body.articles[0])).toEqual(
          expect.arrayContaining([
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "article_img_url",
            "comment_count",
          ])
        );
      });
  })
  test("GET:200 sends an array of article objects sorted by specified column in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("GET:200 sends an empty array and a 200 when passed a valid topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(0);
      });
    })
  test("GET:400 returns an error for invalid sort query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  
  test("GET:400 returns an error for invalid order query", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=invalid_order")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET:404 returns an error when topic filter doesn't match any articles", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Topic not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("200: adds a comment with corresponding article_id", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Test comment",
    };
    return request(app)
      .post("/api/articles/13/comments")
      .send(testComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment.author).toBe(testComment.username);
        expect(response.body.comment.body).toBe(testComment.body);
        expect(response.body.comment.article_id).toBe(13);
      });
  });
  test("404: returns appropriate error message when passed a valid but non-existent article ID", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Test comment",
    };
    return request(app)
      .post("/api/articles/888/comments")
      .send(testComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(`No article found for article id: 888`);
      });
  });
  test("400: returns an error when a required field is missing in the comment", () => {
    const incompleteComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(incompleteComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request: Missing field");
      });
  });
  test("400: returns an error when a passed an invalid ID", () => {
    const testComment = {
      username: "butter_bridge",
      body: "test_comment",
    };
    return request(app)
      .post("/api/articles/bananas/comments")
      .send(testComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("200: Responds with the updated article object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toHaveProperty(
          "author",
          "title",
          "article_id",
          "body",
          "topic",
          "created_at",
          "votes",
          "article_img_url"
        );
        expect(response.body.article.votes).toBe(105);
      });
  });

  test("PATCH: 404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/articles/777")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(`No article found for article id: 777`);
      });
  });

  test("PATCH: 400 sends an appropriate error message when given an invalid article id", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(`Bad request`);
      });
  });

  test("PATCH: 400 sends an appropriate error message when given an invalid vote value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "banana" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET:200 sends an array of user objects with the correct keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toEqual(expect.any(Array));
        expect(response.body.users.length).toBe(4);
        expect(Object.keys(response.body.users[0])).toEqual(
          expect.arrayContaining(["username", "name", "avatar_url"])
        );
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("204 responds with a 204 to confirm deletion", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("404 responds with appropriate error message when passed a valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No comment found for comment id: 999");
      });
  });
  test("400 responds with appropriate error message when passed an invalid comment id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
