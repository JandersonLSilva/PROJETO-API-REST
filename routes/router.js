var express = require('express');
var router = express.Router();

// GET /install: .
router.get('/install', require('../controllers/Install').install);


// ORDERS routes.
    // GET /orders: Retorna todos os pedidos se for admin ou todos pedidos relacionados se for um client.
    router.get('/orders', authenticateToken, getOrdersClient, getOrdersAdmin);

    // POST /orders: Cria um novo pedido.
    router.post('/orders', authenticateToken, isClient, postOrder);

    // GET /orders/:id: Retorna um pedido em específico.
    router.get('/orders/:id', authenticateToken, getOrderById);

    // PUT /orders/:id: Atualiza um pedido.
    router.pull('/orders/:id', authenticateToken, isAdmin, pullOrderById);

    // DELETE /orders/:id: Deleta um pedido.
    router.delete('/orders/:id', authenticateToken, isAdmin, deleteOrderById);


// PRODUCTS routes.
    // GET /products: Retorna todos os produtos.
    router.get('/products', getProducts);

    // POST /products: Cria um novo produto (somente administradores).
    router.post('/products', authenticateToken, isAdmin, postProduct);

    // GET /products/:id: Retorna um produto em específico.
    router.get('/products/:id', getProductById);

    // PUT /products/:id: Atualiza um produto.
    router.pull('/products/:id', authenticateToken, pullProductById);

    // DELETE /products/:id: Deleta um produto.
    router.delete('/products/:id', authenticateToken, deleteProductById);


// USERS routes.
    // SOMENTE ADMINISTRADORES:
        // GET /client: Retorna todos os clientes (somente administradores).
        router.get('/client', authenticateToken, isAdmin, getClients);

        // GET /client/:id: Retorna um cliente em específico (somente administradores).
        router.get('/client/:id', authenticateToken, isAdmin, getClientById);

        // PUT /client/:id: Atualiza um cliente (somente administradores) ou o próprio cliente.
        router.pull('/client/:id', authenticateToken, isAdmin, pullClientById);

        // DELETE /client/:id: Deleta um cliente (somente administradores).
        router.delete('/client/:id', authenticateToken, isAdmin, deleteClientById);

    // QUALQUER CLINTE:
        // POST /signup: Cadastra um novo usuário.
        router.post('/signup', isUnicUser, signup);

        // POST /login: Faz o login no usuário especificado.
        router.post('/login', isUser, login);


// ADMINS routes.
    // GET /admins: Retorna todos os admins.
    router.get('/admins', authenticateToken, isAdmin, getAdmins);

    // POST /admins: Cria um novo admin.
    router.post('/admins', authenticateToken, isAdmin, postAdmin);

    // GET /admins/:id: Retorna um admin em específico.
    router.get('/admins/:id', authenticateToken, isAdmin, getAdminById);

    // PUT /admins/:id: Atualiza um admin.
    router.pull('/admins/:id', authenticateToken, isAdmin, pullAdminById);

    // DELETE /admins/:id: Deleta um admin.
    router.delete('/admins/:id', authenticateToken, isAdmin, deleteAdminById);

module.exports = router;