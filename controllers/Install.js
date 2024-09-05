const sequelize = require('../helpers/db');
const AdminDAO = require('../service/AdminDAO');
const ClientDAO = require('../service/ClientDAO');
const OrderDAO = require('../service/OrderDAO');
const ProductDAO = require('../service/ProductDAO');
const OrderProductDAO = require('../service/OrderProductDAO');

// INSTALL Controller.
module.exports = {
    install: async function(req, res, next) {
        sequelize.sync({force: true});

        res.json({status: true, msg: "Banco de Dados Instalado com Sucesso!"})
    }
};
