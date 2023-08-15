const endpoints = require('../endpoints.json')
const fs = require('fs/promises')

exports.getEndpoints = (req, res) => {
    fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8')
    .then((data) => {
        const parsedEndpoints = JSON.parse(data)
        res.status(200).send({endpoints: parsedEndpoints})
    })
}

