const response = require('../helpers/response');
const UserDAO = require('../service/UserDAO');
const { verifyToken } = require('../middlewares_utils/utils');

module.exports = {
    authenticateToken: async (req, res, next) => {
        const ret = await verifyToken(req);

        if(ret instanceof Error) {
            res.json({auth: false, msg: 'Não foi possível validar esse token!'});
            return;
        }
        next();
    },
    isAdmin: async (req, res, next) => {
        let ret = await verifyToken(req, res);

        if(ret instanceof Error) {
            res.json({auth: false, msg: 'Não foi possível validar esse token!'});
            return;
        }
        let user = await UserDAO.getByCpf(ret.id.cpf);

        (user.role === 'admin') ? next() : res.json({auth: false, msg: 'Você precisa ser um Administrador para acessar essa opção!'});
    }
}