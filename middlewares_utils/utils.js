const response = require('../helpers/response');
const UserDAO = require('../service/UserDAO');
const jwt = require('jsonwebtoken');

module.exports.verifyToken = async (req) => 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            return decoded;
        }
        catch(err){
            return err;
        }
    }

module.exports.isAdmin = async (req) => 
    {
        let ret = await this.verifyToken(req);

        if(ret instanceof Error) return false;
        
        let user = await UserDAO.getByCpf(ret.id.cpf);
        return (user.role === 'admin') ? true : false;
        
    }