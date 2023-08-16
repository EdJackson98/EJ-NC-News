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

describe('/api/teams/:article_id/comments', () => {
    test('GET:200 sends an array of comments to the user by article_id', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual(expect.any(Array));
          expect(Object.keys(response.body.comments[0])).toEqual(
            expect.arrayContaining([
              'comment_id',
              'votes',
              'created_at',
              'author',
              'body',
              'article_id'
            ])
          );
          response.body.comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
          });
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
    // skiptest('Comments should be ordered by age, most recent comments first')
  });