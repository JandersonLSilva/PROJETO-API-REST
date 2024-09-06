const response = require('../helpers/response');
const OrderDAO = require('../service/OrderDAO');

// ORDERS Controller.
module.exports = {
    getOrdersUser: async function(req, res) {
        let orders = await OrderDAO.list();

        if (orders.length === 0) res.json(response.fail(
                'Nenhum Pedido encontrado no banco de dados!', 
                {code: 'ORDERS_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(orders, 'order', 'Listando Pedidos.'));
    },
    // POST /orders: Cria um novo pedido.
    postOrder: async function(req, res) {
        const {cpf_client, status} = req.body;

        OrderDAO.save(cpf_client, status).then(order =>{
            res.json(response.sucess(order, 'order', 'Pedido Inserido.'));
        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });
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
        let order = await OrderDAO.getById(id);

        if (!order) res.json(response.fail(
            'Nenhum Pedido encontrado com esse id no banco de dados!', 
            {code: 'ORDER_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(order, 'order', 'Pedido Retornado.'));
    }
};