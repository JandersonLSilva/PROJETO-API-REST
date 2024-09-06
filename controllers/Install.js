const sequelize = require('../helpers/db');
const UserDAO = require('../service/UserDAO');
const OrderDAO = require('../service/OrderDAO');
const ProductDAO = require('../service/ProductDAO');
const OrderProductDAO = require('../service/OrderProductDAO');
const TokenDAO = require('../service/TokenDAO');

const response = require('../helpers/response');
// INSTALL Controller.
module.exports = {
    install: async function(req, res) {
        await sequelize.sync({force: true});

        
        UserDAO.save('00000000000', 'admin', 'adminadmin', 'admin@gmail.com', '00200000000', 'Rua Admin, 003223','admin').then(user =>{
            res.json(response.sucess(user, 'Admin', 'Administrador Inserido.'));
        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });
        // res.json({status: true, msg: "Banco de Dados Instalado com Sucesso!"});
    }
};
