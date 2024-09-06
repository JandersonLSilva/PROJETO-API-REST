var express = require('express');
var router = express.Router();
// const middl = require()

// GET /install: .
router.get('/install', require('../controllers/Install').install);


// ORDERS routes.
    // GET /orders: Retorna todos os pedidos se for admin ou todos pedidos relacionados se for um user.
    const order = require('../controllers/Order');  
    router.get('/orders', order.getOrdersUser);

    // POST /orders: Cria um novo pedido.
    router.post('/orders', order.postOrder);

    // GET /orders/:id: Retorna um pedido em específico.
    router.get('/orders/:id', order.getOrderById);

    // PUT /orders/:id: Atualiza um pedido.
    router.put('/orders/:id', order.putOrderById);

    // DELETE /orders/:id: Deleta um pedido.
    router.delete('/orders/:id', order.deleteOrderById);


// PRODUCTS routes.
    // GET /products: Retorna todos os produtos.
    const products = require('../controllers/Product');
    router.get('/products', products.getProducts);

    // POST /products: Cria um novo produto (somente administradores).
    router.post('/products', products.postProduct);

    // GET /products/:id: Retorna um produto em específico.
    router.get('/products/:id', products.getProductById);

    // PUT /products/:id: Atualiza um produto.
    router.put('/products/:id', products.putProductById);

    // DELETE /products/:id: Deleta um produto.
    router.delete('/products/:id', products.deleteProductById);


// USERS routes.
    const user = require('../controllers/User');
    // SOMENTE ADMINISTRADORES:
        // GET /user: Retorna todos os usuários (somente administradores).
        router.get('/users', require('../middlewares/isAdmin').isAdmin, user.getUsers);

        // GET /user/:cpf: Retorna um usuário em específico (somente administradores).
        router.get('/users/:cpf', user.getUserByCpf);
        router.post('/users', user.postUser);

        // PUT /user/:cpf: Atualiza um usuário (somente administradores) ou o próprio usuário.
        router.put('/users/:cpf', user.putUserByCpf);

        // DELETE /user/:cpf: Deleta um usuário (somente administradores).
        router.delete('/users/:cpf', user.deleteUserByCpf);

    // QUALQUER CLINTE:
        // POST /signup: Cadastra um novo usuário.
        router.post('admin/signup', user.signupAdmin);
        router.post('user/signup', user.signup);

        // POST /login: Faz o login no usuário especificado.
        router.post('/login', user.login);

module.exports = router;