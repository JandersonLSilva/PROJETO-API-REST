const response = require('../helpers/response');
const UserDAO = require('../service/UserDAO');
const jwt = require("jsonwebtoken");

module.exports = {
    isAdmin: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let cpf;

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) res.json({auth: false, msg: 'Não foi possível validar esse token!'});
            else cpf = decoded.id.cpf;
        });

        let user = await UserDAO.getByCpf(cpf);

        if (!user) res.json(response.fail(
            'Nenhum Usuário encontrado com esse cpf no banco de dados!', 
            {code: 'USER_NOT_FOUND', status: 404})
        );
        else {
            (user.role === 'admin') ? next() : res.json({auth: false, msg: 'Você precisa ser um Administrador para acessar essa opção!'});
        }
    }
}