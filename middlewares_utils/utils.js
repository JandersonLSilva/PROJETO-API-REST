const response = require('../helpers/response');
const UserDAO = require('../service/UserDAO');
const jwt = require('jsonwebtoken');

module.exports = {
    isAdmin: async (req, res) => {
        ret = this.verifyToken(req);

        if(ret instanceof Error) {
            console.log({auth: false, msg: 'Não foi possível validar esse token!'});
            return false;
        }

        let user = await UserDAO.getByCpf(ret.id.cpf);
        console.log(user.role)
        return (user.role === 'admin') ? true : false;
        
    },
    verifyToken: (req) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) {
                return err;
            }
            else return decoded;
            
        });
    }
}