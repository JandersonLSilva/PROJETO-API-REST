const response = require('../helpers/response');
const ProductDAO = require('../service/ProductDAO');

// PRODUCTS Controller.
module.exports = {
    // GET /products: Retorna todos os produtos.
    getProducts: async function(req, res) {
        let products = await ProductDAO.list();

        if (products.length === 0) res.json(response.fail(
                'Nenhum Produto encontrado no banco de dados!', 
                {code: 'PRODUCTS_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(products, 'product', 'Listando Produtos.'));
    },

    // POST /products: Cria um novo produto (somente administradores).
    postProduct: async function(req, res) {
        const {name, description, value, category, quantity} = req.body;

        ProductDAO.save(name, description, value, category, quantity).then(product =>{
            res.json(response.sucess(product, 'product', 'Produto Inserido.'));
        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });

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