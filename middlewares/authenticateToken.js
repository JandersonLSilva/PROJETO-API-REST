const response = require('../helpers/response');
const UserDAO = require('../service/UserDAO');
const jwt = require("jsonwebtoken");

module.exports = {
    authenticateToken: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) res.json({auth: false, msg: 'Não foi possível validar esse token!'});
            else {
                next();
            }
            
        });
    }
}