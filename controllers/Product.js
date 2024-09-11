const response = require('../helpers/response');
const ProductDAO = require('../service/ProductDAO');

// PRODUCTS Controller.
module.exports = {
    // GET /products: Retorna todos os produtos.
    getProducts: async function(req, res) {
        // #swagger.summary = 'Lista todas os Produtos.'
        // #swagger.tags = ['Products']
        // #swagger.description = 'Essa rota retorna todos os produtos de uma página e limite informado, como um objeto JSON.'

       /* #swagger.responses[200] = {
            description: 'Produto(s) Retornado(s).',
            schema: { $ref: "#/schemas/array_product" }
        }*/
        /* #swagger.responses[404] = {
            "description": "Nenhum Produto encontrado no banco de dados!"
        }*/
        const {page, limit} = req.params;
        try {
            let products = await ProductDAO.list(page, limit);
    
            if (products.length === 0) throw {msg: 'Nenhum Produto encontrado no banco de dados!', obj: {code: 'NO_FOUND', status: 404}};
            
            res.json(response.sucess(products, 'Products', 'Listando Produtos.'));
        } 
        catch (err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },

    // POST /products: Cria um novo produto (somente administradores).
    postProduct: async function(req, res) {
        // #swagger.summary = 'Cadastrar os Produtos.'
        // #swagger.tags = ['Products']
        // #swagger.description = 'Essa rota cadastra um novo produto e o retorna, como um objeto JSON (somente administradores).'
        /* #swagger.parameters = {
            name: "body",
            in: "body",
            schema: { $ref: "#/schemas/save_product" }
        }*/
        /* #swagger.responses[200] = {
            description: 'Produto(s) Inserido(s).',
            schema: { $ref: "#/schemas/array_product" }
        }*/
        /* #swagger.responses[403] = {
            "description": "Não foi possível válidar os dados inseridos"
        }*/

        
        const products = req.body;
        let return_products = [];

        try{ 
            if(Array.isArray(products) && products){
                for(let i = 0; i < products.length; i++)
                    return_products.push( await ProductDAO.save(products[i].name, products[i].description, products[i].value, products[i].category, products[i].quantity));
                if(return_products === 0) throw {msg: 'Não foi possível válidar os dados inseridos', obj: {code: 'BAD_REQUEST', status: 403 }};
            } 
            else if(products) {
                return_products.push( await ProductDAO.save(products.name, products.description, products.value, products.category, products.quantity));
            }
            else throw {msg: 'Não foi possível válidar os dados inseridos', obj: {code: 'BAD_REQUEST', status: 403 }};
            
            res.json(response.sucess(return_products, 'Product', 'Produto(s) Inserido(s).'));
        }
        catch(err) { 
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },
   
    // PUT /products/:id: Atualiza um produto.
    putProductById: async function(req, res) {
        // #swagger.summary = 'Atualizar um Produto.'
        // #swagger.tags = ['Products']
        // #swagger.description = 'Essa rota atualiza um produto com base no id informado e o retorna, como um objeto JSON (somente administradores).'
        /* #swagger.parameters = {
            name: "body",
            in: "body",
            schema: { $ref: "#/schemas/save_product" }
        }*/
        /* #swagger.responses[200] = {
            description: 'Produto Atualizado.',
            schema: { $ref: "#/schemas/product" }
        }*/
        /* #swagger.responses[404] = {
            "description": "Nenhum Produto encontrado com esse id no banco de dados!"
        }*/

        const id = req.params.id;
        const {name, description, value, category, quantity} = req.body;

        try {
            let ret = await ProductDAO.update(id, name, description, value, category, quantity);
            if(ret === 0) throw {msg: 'Nenhum Produto encontrado com esse id no banco de dados!', obj: {code: 'NO_FOUND', status: 404}};

            let product = await ProductDAO.getById(id);
            res.json(response.sucess(product, 'Product', 'Produto Atualizado.'));
        } 
        catch (err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },

    // DELETE /products/:id: Deleta um produto.
    deleteProductById: async function(req, res) {
        // #swagger.summary = 'Deletar um Produto.'
        // #swagger.tags = ['Products']
        // #swagger.description = 'Essa rota apaga um produto com base no id informado e o retorna, como um objeto JSON (somente administradores).'

        /* #swagger.responses[200] = {
            description: 'Produto Deletado.',
            schema: { $ref: "#/schemas/product" }
        }*/
        /* #swagger.responses[404] = {
            "description": "Nenhum Produto encontrado com esse id no banco de dados!"
        }*/

        const id = req.params.id;

        try {
            let product = await ProductDAO.getById(id);
            if (!product) throw {msg: 'Nenhum Produto encontrado com esse id no banco de dados!', obj: {code: 'NO_FOUND', status: 404}};
            
            await ProductDAO.delete(id);
            console.log(product)
            res.json(response.sucess(product, 'product', 'Produto Deletado.'));
        } 
        catch (err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
        
    },
    
    // GET /products/:id: Retorna um produto em específico.
    getProductById: async function(req, res) {
        // #swagger.summary = 'Listar um Produto.'
        // #swagger.tags = ['Products']
        // #swagger.description = 'Essa rota retorna um produto (como um objeto JSON) em específico com base no id informado no parametro da rota.'

        /* #swagger.responses[200] = {
            description: 'Produto Retornado.',
            schema: { $ref: "#/schemas/product" }
        }*/
        /* #swagger.responses[404] = {
            "description": "Nenhum Produto encontrado com esse id no banco de dados!"
        }*/

        const id = req.params.id;

        try{
            let product = await ProductDAO.getById(id);
    
            if (!product) throw {msg: 'Nenhum Produto encontrado com esse id no banco de dados!', obj: {code: 'NO_FOUND', status: 404}};

            res.json(response.sucess(product, 'product', 'Produto Retornado.'));
        }
        catch (err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    }

};

