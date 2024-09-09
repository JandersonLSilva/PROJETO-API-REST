const response = require('../helpers/response');
const ProductDAO = require('../service/ProductDAO');

// PRODUCTS Controller.
module.exports = {
    // GET /products: Retorna todos os produtos.
    getProducts: async function(req, res) {
        const {page, limit} = req.params;

        let products = await ProductDAO.list(page, limit);

        if (products.length === 0) res.json(response.fail(
                'Nenhum Produto encontrado no banco de dados!', 
                {code: 'PRODUCTS_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(products, 'product', 'Listando Produtos.'));
    },

    // POST /products: Cria um novo produto (somente administradores).
    postProduct: async function(req, res) {
        const products = req.body;
        let return_products = [];

        try{ 
            if(Array.isArray(return_products) && products){
                for(let i = 0; i < products.length; i++)
                    return_products.push( await ProductDAO.save(products[i].name, products[i].description, products[i].value, products[i].category, products[i].quantity));
                res.json(response.sucess(return_products, 'products', 'Produto(s) Inserido(s).'));
            } 
            else if(products) {
                return_products.push( await ProductDAO.save(products.name, products.description, products.value, products.category, products.quantity));
                res.json(response.sucess(return_products, 'products', 'Produto(s) Inserido(s).'));
            }
            else res.json(response.fail('Inserção de forma inválida dos dados!'));
        }
        catch(err) { 
            res.json(response.fail('Inserção de forma inválida dos dados!', err));
        }
    },
   
    // PUT /products/:id: Atualiza um produto.
    putProductById: async function(req, res) {
        const {id} = req.params;
        const {name, description, value, category, quantity} = req.body;

        ProductDAO.update(id, name, description, value, category, quantity).then(ret =>{

            if(ret[0] !== 0) ProductDAO.getById(id)
                .then(product => {res.json(response.sucess(product, 'product', 'Produto Atualizado.'))})
                .catch(err=>{
                    res.json(response.fail('Erro Inesperado!', err));
                }); 
                
            else res.json(response.fail(
                'Nenhum Produto encontrado com esse id no banco de dados!', 
                {code: 'PRODUCT_NOT_FOUND', status: 404})
            );
        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });
    },

    // DELETE /products/:id: Deleta um produto.
    deleteProductById: async function(req, res) {
        const {id} = req.params;
        let product;
        ProductDAO.getById(id).then(produtById => {product = produtById}).catch(err=>{ res.json(response.fail('Erro Inesperado!', err)) }); 
        
        let ret = await ProductDAO.delete(id);

        if (ret !== 1) res.json(response.fail(
            'Nenhum Produto encontrado com esse id no banco de dados!', 
            {code: 'PRODUCT_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(product, 'product', 'Produto Deletado.'));
        
    },
    
    // GET /products/:id: Retorna um produto em específico.
    getProductById: async function(req, res) {
        const {id} = req.params;
        let product = await ProductDAO.getById(id);

        if (!product) res.json(response.fail(
            'Nenhum Produto encontrado com esse id no banco de dados!', 
            {code: 'PRODUCT_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(product, 'product', 'Produto Retornado.'));
        
    }

};