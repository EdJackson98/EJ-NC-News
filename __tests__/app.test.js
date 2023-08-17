const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const endpointsData = require('../endpoints.json');

const {topicData, articleData, commentData, userData} = require('../db/data/test-data/');

beforeEach(() => seed( {topicData, articleData, commentData, userData} ));
afterAll(() => db.end());

describe("GET: /api/topics", () => {
    test("200: Responds with an array of topics with the correct keys", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body : { topics } }) => {
            expect(topics.length).toBe(3);
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('description')
                expect(topic).toHaveProperty('slug')
            })
        })
    })
    test("404: Responds with an appropriate error when path request is not found", () => {
        return request(app)
        .get("/api/t0pics")
        .expect(404)
        .then((response) => {
            expect(response.status).toBe(404)
        })
    })
});

describe('/api', () => {
    test('should return an object containing all available endpoints', (done) => {
        request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                const body = response.body;
                expect(body.endpoints).toEqual(endpointsData);
                done();
        })
    });
});

describe("GET: /api/articles/:article_id", () => {
    test("200: Responds with an article object with the correct keys", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
            expect(response.body.article)
            .toHaveProperty('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'article_img_url')
        })
    })
    test('GET:404 sends an appropriate and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/99')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe(`Article ID not found`);
        })
    })
    test('GET:400 sends an appropriate and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/banana')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Invalid ID');
        })
    })
})

describe('/api/article/:article_id/comments', () => {
    test('GET:200 sends an array of comments to the user by article_id', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const { comments } = response.body;
            expect(comments).toEqual(expect.any(Array));
            comments.forEach((comment) => {
              expect(comment).toEqual(expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: 1
              }));
            });
          });
      });
    test('GET:200 sends an empty array when there are no comments for the article_id', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then((response) => {
            expect(response.body.msg).toBe('No comments found on article id: 2')
          });
      });
    test('GET:404 sends an appropriate error message when given a valid but non-existent id', () => {
      return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('No article found for article id: 999');
        });
    });
    test('GET:400 sends an appropriate error message when given an invalid ID', () => {
        return request(app)
        .get('/api/articles/banana/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid ID');
          });
    })
    test('comments should return, ordered by created_at, ascendingly', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toBeSortedBy('created_at', {ascendingly: true})
        })
    })
  });

describe('/api/articles', () => {
    test('GET:200 sends an array of article objects with the correct keys', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual(expect.any(Array));
          expect(response.body.articles.length).toBe(13)
          expect(Object.keys(response.body.articles[0])).toEqual(
            expect.arrayContaining(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'])
          );
        });
    });
    test('Should return articles in created_at order, descendingly', () => {
       return request(app) 
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toBeSortedBy('created_at', {descending: true})
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('200: adds a comment with corresponding article_id', () => {
        const testComment = {
            username: 'butter_bridge',
            body: 'Test comment',
        };
        return request(app)
            .post('/api/articles/1/comments')
            .send(testComment)
            .expect(201)
            .then((response) => {
                expect(response.body.comment.author).toBe(testComment.username);
                expect(response.body.comment.body).toBe(testComment.body);
                expect(response.body.comment.article_id).toBe(1)
            });
    });
    test('404: returns appropriate error message when passed a valid but non-existent article ID', () => {
        const testComment = {
            username: 'butter_bridge',
            body: 'Test comment',
        };
        return request(app)
            .post('/api/articles/888/comments')
            .send(testComment)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe(`No article found for article id: 888`);
            });
    });
    test('400: returns an error when a required field is missing in the comment', () => {
        const incompleteComment = {
            username: 'butter_bridge',
        };
        return request(app)
            .post('/api/articles/1/comments')
            .send(incompleteComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad Request: Missing field');
            });
    });
    test('400: returns an error when a passed an invalid ID', () => {
        const testComment = {
            username: 'butter_bridge',
            body: 'test_comment',
        };
        return request(app)
            .post('/api/articles/bananas/comments')
            .send(testComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid ID');
            });
    });
});

