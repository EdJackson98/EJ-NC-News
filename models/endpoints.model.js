const endpointsData = require('../endpoints.json');

exports.fetchEndpoints = () => {
    return readFile('../endpoints.json', 'utf-8')
    .then((data) => {
        const endpoints = JSON.parse(data);
        return endpoints
    })
};

