const { getEndpointsData } = require('../models/endpoints.model');

exports.getApiInfo = (req, res) => {
    const endpointsData = getEndpointsData();
    res.json(endpointsData);
};
