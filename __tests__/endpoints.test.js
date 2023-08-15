const app = require('../app');
const request = require('supertest');
const endpointsData = require('../endpoints.json');

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
