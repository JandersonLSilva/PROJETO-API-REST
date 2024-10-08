var express = require('express');
var router = express.Router();
const {isAdmin, authenticateToken} = require('../middlewares_utils/middlewares');

// GET /install: .
router.get('/install', require('../controllers/Install').install);

// Filter routes.
const {indexFilter, statusFilter } = require('../controllers/filter');
router.get('/products/filter', indexFilter);

router.get('/orders/filter/:status', statusFilter);


// ORDERS routes.
    // GET /orders/:page/:limit Retorna todos os pedidos se for admin ou todos pedidos relacionados se for um user.
    const order = require('../controllers/Order');  
    router.get('/orders', authenticateToken, order.getOrdersUser);
    
    // POST /orders: Cria um novo pedido.
    router.post('/orders', authenticateToken, order.postOrder);

    // GET /orders/:id: Retorna um pedido em específico.
    router.get('/orders/:id', authenticateToken, order.getOrderById);

    // PUT /orders/:id: Atualiza um pedido (somente administradores).
    router.put('/orders/:id', authenticateToken, isAdmin, order.putOrderById);

    // DELETE /orders/:id: Deleta um pedido (somente administradores).
    router.delete('/orders/:id', authenticateToken, isAdmin, order.deleteOrderById);


// PRODUCTS routes.
    // GET /products/:page/:limit Retorna todos os produtos.
    const products = require('../controllers/Product');
    router.get('/products', products.getProducts);

    // POST /products: Cria um novo produto (somente administradores).
    router.post('/products', authenticateToken, isAdmin, products.postProduct);

    // GET /products/:id: Retorna um produto em específico.
    router.get('/products/:id', products.getProductById);

    // PUT /products/:id: Atualiza um produto.
    router.put('/products/:id', authenticateToken, isAdmin, products.putProductById);

    // DELETE /products/:id: Deleta um produto.
    router.delete('/products/:id', authenticateToken, isAdmin, products.deleteProductById);


// USERS routes.
    const user = require('../controllers/User');
    // SOMENTE ADMINISTRADORES:
        // GET /user/:page/:limit Retorna todos os usuários (somente administradores).
        router.get('/users', authenticateToken, isAdmin, user.getUsers);

        // GET /user/:cpf: Retorna um usuário em específico (somente administradores).
        router.get('/users/:cpf', authenticateToken, isAdmin, user.getUserByCpf);

        // PUT /user/:cpf: Atualiza um usuário (somente administradores) ou o próprio usuário.
        router.put('/users/:cpf', authenticateToken, user.putUserByCpf);

        // DELETE /user/:cpf: Deleta um usuário (somente administradores).
        router.delete('/users/:cpf', authenticateToken, isAdmin, user.deleteUserByCpf);

        // POST /signup: Cadastra um novo administrador.
        router.post('/admin/signup', authenticateToken, isAdmin, user.adminSignup);
    
    // QUALQUER USUÁRIO:
        // POST /signup: Cadastra um novo usuário.
        router.post('/users/signup', user.signup);

        // POST /login: Faz o login no usuário especificado.
        router.post('/login', user.login);

    // QUALQUER CLIENTE:
        // POST /user: Retorna os dados do usuário logado/token.
        router.get('/user', authenticateToken, user.getUser);


module.exports = router;