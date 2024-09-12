const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        version: "1.0.0",
        title: "API REST Virtual Store",
        description: "API REST para gerenciamento de uma Loja Virtual."
    },
    schemas: require('./schemas.json')
   
}
const output = './swagger_doc.json';
const endpoints = ['./index.js', './controllers/Install.js'];

swaggerAutogen(output, endpoints, doc);
