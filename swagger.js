const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        version: "1.0.0",
        title: "API REST Virtual Store",
        description: "API REST para gerenciamento de uma Loja Virtual."
    },
    schemas: require('./schemas.json')
    // "/products/{page}/{limit}": {
    //   "get": {
    //     "tags": [
    //       "Products"
    //     ],
    //     "summary": "Lista todas os Produtos",
    //     "description": "Essa rota retorna todos os produtos de uma página e limite informado, como um objeto JSON.",
    //     "parameters": [
    //       {
    //         "name": "page",
    //         "in": "path",
    //         "required": true,
    //         "type": "string"
    //       },
    //       {
    //         "name": "limit",
    //         "in": "path",
    //         "required": true,
    //         "type": "string"
    //       }
    //     ],
    //     "responses": {
    //       "200": {
    //         "code": "OK",
    //         "description": "Produtos Retornados",
    //         "content": {
    //         "application/json": {
    //           "schema": {
    //             "type": "array",
    //             "items": {
    //               "type": "object",
    //               "properties": {
    //                     "id": {
    //                         "type": "integer"
    //                     },
                    
    //                     "name":{
    //                         "type": "string"
    //                     },
                    
    //                     "description":{
    //                         "type": "string"
    //                     },
                    
    //                     "value":{
    //                         "type": "double"
    //                     },
                    
    //                     "category":{
    //                         "type": "string"
    //                     },
    //                     "quantity":{
    //                         "type": "integer"
    //                     }
    //                 }
    //               },
    //               "example": {
    //                 "id": 1,
    //                 "name": "Produto 1"
    //               }
    //             }
    //           }
    //         }
    //       },
    //       "404": {
    //         "code": "NO_FOUND",
    //         "description": "Nenhum Produto encontrado no banco de dados!"
    //       }
    //     }
    //   }
    // }
}
const output = './swagger_doc.json';
const endpoints =['./index.js'];

swaggerAutogen(output, endpoints, doc);
