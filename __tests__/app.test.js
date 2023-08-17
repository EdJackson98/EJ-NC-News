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
    test('adds a comment with corresponding article_id', () => {
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
            });
    });
});