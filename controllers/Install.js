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
        // #swagger.summary = 'Instalar o Banco de Dados.'
        // #swagger.tags = ['Install']
        // #swagger.description = 'Essa rota instala o banco de dados.'
        /* #swagger.responses[200] = {
            description: 'Banco de Dados Instalado com Sucesso!',
            schema: {
                "msg": "Banco de Dados Instalado com Sucesso!"
            }
        }*/

        await sequelize.sync({force: true});

        
        UserDAO.save('00000000000', 'admin', 'adminadmin', 'admin@gmail.com', '00000000000', 'Rua Admin, 000','admin').then(user =>{
            console.log(response.sucess(user, 'Admin', 'Administrador Inserido.'));
            res.json({status: true, msg: "Banco de Dados Instalado com Sucesso!"});
        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });
    }
};
