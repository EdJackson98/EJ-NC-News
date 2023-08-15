const app = require('../app');
const request = require('supertest');
const endpointsData = require('../endpoints.json');

describe('/api', () => {
    test('should return an object containing all available endpoints', (done) => {
        request(app)
            .get('/api')
            .expect(200)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.body).toEqual(endpointsData);
                done();
            });
    });
});