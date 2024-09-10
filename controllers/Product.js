const response = require('../helpers/response');
const ProductDAO = require('../service/ProductDAO');

// PRODUCTS Controller.
module.exports = {
    // GET /products: Retorna todos os produtos.
    getProducts: async function(req, res) {
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
        const id = req.params.id;
        const {name, description, value, category, quantity} = req.body;

        try {
            let ret = await ProductDAO.update(id, name, description, value, category, quantity);
            if(ret === 0) throw {msg: 'Nenhum Produto encontrado com esse id no banco de dados!', obj: {code: 'NO_FOUND', status: 404}};

            let product = await ProductDAO.getById(id); 
            res.json(response.sucess(product, 'Product', 'Produto Atualizado.'))
        } 
        catch (err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },

    // DELETE /products/:id: Deleta um produto.
    deleteProductById: async function(req, res) {
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