const response = require('../helpers/response');
const OrderProductDAO = require('../service/OrderProductDAO');
const OrderDAO = require('../service/OrderDAO');
const OrderProductModel = require('../models/OrderProduct');
const { isAdmin, verifyToken } = require("../middlewares_utils/utils");
const OrderModel = require('../models/Order');
const { decode } = require('jsonwebtoken');

// ORDERS Controller.
module.exports = {
    getOrdersUser: async function(req, res) {
        const {page, limit} = req.params;
        let orders;

        try {
            const decoded = await verifyToken(req);

            if (await isAdmin(req)) orders = await OrderDAO.list(page, limit);
            else orders = await OrderDAO.list(page, limit, decoded.id.cpf);
            
            if (orders.length === 0) throw {msg: 'Nenhum Pedido encontrado no banco de dados!', obj: {code: 'NO_FOUND', status: 404}};
            
            for(let i = 0; i < orders.length; i++){
                let order_products = await OrderProductModel.findAll({where: {id_order: orders[i].id}});

                let products_id = [];

                order_products.forEach(order_product => {
                    orders.forEach(order => {
                        if(order.id === order_product.dataValues.id_order)
                            products_id.push(order_product.dataValues.id_product);
                    });
                });
                orders[i].dataValues['products_id'] = products_id;
            }
            res.json(response.sucess(orders, 'Order', 'Listando Pedidos.'));
            
        } catch (err) {
            console.log(err)
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },

    // POST /orders: Cria um novo pedido.
    postOrder: async function(req, res) {
        const orders = req.body;
        let return_orders = [];

        try{ 
            if(Array.isArray(orders) && orders){
                for(let i = 0; i < orders.length; i++){
                    if ((!orders[i].products_id) || (orders[i].products_id.length == 0)) 
                        throw {msg: "Não foi possível validar o campo products_id, informe-o corretamente!", obj: {code: "BAD_REQUEST", status: "400"}};
                    let products = [];

                    return_orders.push( await OrderDAO.save(orders[i].cpf_user, orders[i].status, orders[i].total_value));

                    for(let j = 0; j < orders[i].products_id.length; j++){
                        await OrderProductDAO.save(return_orders[i].id, orders[i].products_id[j].id);
                        products.push(orders[i].products_id[j].id);
                    }
                    return_orders[i].dataValues['products_id'] = products;
                }
                if(return_orders.length === 0) throw {msg: 'Os dados inseridos não são válidos!'};
            } 
            else if(orders && orders.products_id) {
                if ((!orders.products_id) || (orders.products_id.length == 0)) 
                    throw {msg: "O campo product_id não existe, informe-o para cadastrar um pedido", obj: {code: "BAD_REQUEST", status: "400"}};
                return_orders.push( await OrderDAO.save(orders.cpf_user, orders.status, orders.total_value));
            }
            else throw {msg: 'Os dados inseridos não são válidos!'};
            res.json(response.sucess(return_orders, 'orders', 'Pedido(s) Inserido(s).'));
        }
        catch(err) { 
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },
    
    // PUT /orders/:id: Atualiza um pedido.
    putOrderById: async function(req, res) {
        const id  = req.params.id;
        const { status, total_value, products_id } = req.body;
        let products = [];

        try {
            await OrderDAO.update(id, status, total_value);

            let order = await OrderModel.findOne({where: {id: id}});
            if(!order) throw {msg: "Nenhum Pedido foi encontrado com esse id na base de dados!", obj: {code: "NO_FOUND", status: "404"}};

            await OrderProductDAO.delete(id);

            for (let i = 0; i < products_id.length; i++) {
                await OrderProductDAO.save(id, products_id[i].id);
                products.push(products_id[i].id);

            } 
            order.dataValues['products_id'] = products;
            if(products.length === products_id.length) 
                res.json(response.sucess({ order: order }, 'Order', 'Pedido Atualizado.'));

        } catch(err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },
    
    // DELETE /orders/:id: Deleta um pedido.
    deleteOrderById: async function(req, res) {
        const {id} = req.params;
        let products_id = [];

        try{
            let order = await OrderDAO.getById(id); 
            
            await OrderDAO.delete(id);
            const order_products = await OrderProductModel.findAll({where: {id_order: id}});
            const ret = await OrderProductDAO.delete(id);
            order_products.forEach(order_product => {
                products_id.push(order_product.id_product);
            });
            order.dataValues['products_id'] = products_id;

            if (!ret) throw {msg: 'Nenhum Pedido encontrado com esse id no banco de dados!', obj: {code: 'NO_FOUND', status: 404}}
            res.json(response.sucess({ order: order }, 'Order', 'Pedido Deletado.'));
        }
        catch(err){
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },
    
    // GET /orders/:id: Retorna um pedido em específico.
    getOrderById: async function(req, res) {
        const id = req.params.id;
        let products_id = [];
        let order;

        try{
            order = await OrderDAO.getById(id);
            if(!order) throw  {msg: 'Nenhum Pedido encontrado com esse id no banco de dados!', obj: {code: 'NO_FOUND', status: 404}};

            let order_products = await OrderProductModel.findAll({where: {id_order: id}});
            order_products.forEach(order_product => {
                products_id.push(order_product.id_product);
            });
            order.dataValues['products_id'] = products_id;

            if(await isAdmin(req)) {
                res.json(response.sucess({ order: order }, 'Order', 'Pedido Retornado.'));
            }
            else{
                let decoded = await verifyToken(req);
                if(decoded.id.cpf === order.cpf) res.json(response.sucess({ order: order }, 'Order', 'Pedido Retornado.'));
                else throw {err: {msg: 'O Usuário não tem acesso ao id do Pedido informado!', obj: {code: 'ACCESS_DENIED', status: 403}}};
            }
        }
        catch(err){
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
        
    }
};
        