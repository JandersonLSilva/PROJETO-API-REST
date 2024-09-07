const response = require('../helpers/response');
const OrderProductDAO = require('../service/OrderProductDAO');
const OrderDAO = require('../service/OrderDAO');
const OrderProductModel = require('../models/OrderProduct');

// ORDERS Controller.
module.exports = {
    getOrdersUser: async function(req, res) {
        const {page, limit} = req.params;
        let orders = await OrderDAO.list(page, limit);

        if (orders.length === 0) res.json(response.fail(
                'Nenhum Pedido encontrado no banco de dados!', 
                {code: 'ORDERS_NOT_FOUND', status: 404})
        );
        else {
            const Orders = [];
            let i;
            for(i = 0; i < orders.length; i++){
                console.log(orders[i].id);
                OrderProductModel.findAll({where: {id_order: orders[i].id}}).then(products_id => {
                    orders[i]['products_id'] = products_id;
                    console.log(products_id);
                    Orders.push(orders[i]);

                }).catch (err => { console.log(response.fail('Erro ao tentar listar os dados!', err)) });
            }
            if(i === orders.length) res.json(response.sucess(Orders, 'Order', 'Listando Pedidos.'));

        }
    },
    // POST /orders: Cria um novo pedido.
    postOrder: async function(req, res) {
        const {cpf_user, status, total_value, products_id} = req.body;

        try {
            const order = await OrderDAO.save(cpf_user, status, total_value);
            const products = [];
            let i;
            for (i = 0; i < products_id.length; i++) {
                try {
                    await OrderProductDAO.save(products_id[i].id, order.id);
                    products.push(products_id[i].id);
                } catch (err) {
                    throw err;
                }
            } if(i === products_id.length) res.json(response.sucess({ order: order, products_id: products }, 'Order', 'Pedido Inserido.'));

        } catch(err) {
            res.json(response.fail('Erro ao tentar salvar os dados!', err));
        }
    },
    
    // PUT /orders/:id: Atualiza um pedido.
    putOrderById: async function(req, res) {
        const {id} = req.params;
        const {status} = req.body;

        OrderDAO.update(id, status).then(ret =>{

            if(ret[0] !== 0) OrderDAO.getById(id)
                .then(order => {res.json(response.sucess(order, 'order', 'Pedido Atualizado.'))})
                .catch(err=>{
                    res.json(response.fail('Erro Inesperado!', err));
                }); 
                
            else res.json(response.fail(
                'Nenhum Pedido encontrado com esse id no banco de dados!', 
                {code: 'ORDER_NOT_FOUND', status: 404})
            );
        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });
    },
    
    // DELETE /orders/:id: Deleta um pedido.
    deleteOrderById: async function(req, res) {
        const {id} = req.params;
        let order;
        OrderDAO.getById(id).then(produtById => {order = produtById}).catch(err=>{ res.json(response.fail('Erro Inesperado!', err)) }); 
        
        let ret = await OrderDAO.delete(id);

        if (ret !== 1) res.json(response.fail(
            'Nenhum Pedido encontrado com esse id no banco de dados!', 
            {code: 'ORDER_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(order, 'order', 'Pedido Deletado.'));
    },
    
    // GET /orders/:id: Retorna um pedido em específico.
    getOrderById: async function(req, res) {
        const {id} = req.params;

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let cpf;

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) res.json({auth: false, msg: 'Não foi possível validar esse token!'});
            else {
                cpf = decoded.id.cpf;
                role = decoded.id.role;
            }
        });

        let orderV = await OrderDAO.findOne({where: {cpf_user: cpf}});

        if(orderV.id === id || role === 'admin'){
            let order = await OrderDAO.getById(id);

            if (!order) res.json(response.fail(
                'Nenhum Pedido encontrado com esse id no banco de dados!', 
                {code: 'ORDER_NOT_FOUND', status: 404})
            );
            else res.json(response.sucess(order, 'order', 'Pedido Retornado.'));
        }
        else res.json(response.fail(
            'Nenhum Pedido encontrado com esse id no relacionado ao seu CPF banco de dados!', 
            {code: 'ORDER_NOT_FOUND', status: 404}));
        
    }
};
        