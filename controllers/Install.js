const sequelize = require('../helpers/db');
const UserDAO = require('../service/UserDAO');

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

        try{
            await sequelize.sync({force: true});

        
            const user = UserDAO.save('00000000000', 'admin', 'adminadmin', 'admin@gmail.com', '00000000000', 'Rua Admin, 000','admin')
            if(!user) throw {msg: "Erro ao tentar instalar o Banco de Dados"};

            console.log(response.sucess(user, 'Admin', 'Administrador Inserido.'));
            res.json({status: true, msg: "Banco de Dados Instalado com Sucesso!"});
        }
        catch(err){
            res.json(response.fail(err.msg || 'Erro Inesperado!', err.obj || err));
        }
    }
};
