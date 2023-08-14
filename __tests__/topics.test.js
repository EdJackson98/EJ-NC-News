const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');

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
            topics.forEach((item) => {
                expect(item).toHaveProperty('description')
                expect(item).toHaveProperty('slug')
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