const response = require('../helpers/response');
const UserDAO = require('../service/UserDAO');
const TokenDAO = require('../service/TokenDAO');
const TokenModel = require('../models/Token');
const {isAdmin, verifyToken} = require('../middlewares_utils/utils');
const jwt = require("jsonwebtoken");

// USERS Controller.
module.exports = {
    // GET /users: Retorna todos os usuários.
    getUsers: async function(req, res) {
        const {page, limit} = req.params;
        try{
            let users = await UserDAO.list(page, limit);

            if (users.length === 0) throw {msg: 'Nenhum Usuário encontrado no banco de dados!', obj: {code: 'NO_FOUND', status: 404}}
            res.json(response.sucess(users, 'user', 'Listando Usuários.', page, limit, users.length));
        }
        catch(err){
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }

    },

    // PUT /users/:cpf: Atualiza um usuário.
    putUserByCpf: async function(req, res) {
        const cpf = req.params.cpf;
        const { password, fullName, email, contact_number, address } = req.body;
        let return_user;
        
        try{
            let ret = await verifyToken(req);
            if(await isAdmin(req)){
                await UserDAO.update(cpf, password, fullName, email, contact_number, address);
            }
            else{
                if(cpf === ret.id.cpf) 
                    await UserDAO.update(cpf, password, fullName, email, contact_number, address);
                
                else throw {msg: 'O CPF digitado não bate com o cadastrado', obj: {code: 'NO_FOUND', status: 404}};
            }

            return_user = await UserDAO.getByCpf(cpf);
            if(!return_user) throw {msg: 'Dados inválidos!'};
            res.json(response.sucess(return_user, 'user', 'Usuário Atualizado.'));
        }
        catch(err) { 
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }

    },

    // DELETE /users/:cpf: Deleta um usuário.
    deleteUserByCpf: async function(req, res) {
        const cpf = req.params.cpf;
        try{
            let UserByCpf = await UserDAO.getByCpf(cpf);
            if (!UserByCpf) throw {msg:'Nenhum Usuário encontrado com esse cpf no banco de dados!', obj: {code: 'NO_FOUND', status: 404}};
    
            await UserDAO.delete(cpf);
    
            res.json(response.sucess(UserByCpf, 'User', 'Usuário Deletado.'));
        }
        catch(err){
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
        
    },
    
    // GET /users/:cpf: Retorna um usuário em específico.
    getUserByCpf: async function(req, res) {
        const cpf = req.params.cpf;
        try {
            let user = await UserDAO.getByCpf(cpf);
    
            if (!user) throw {msg: 'Nenhum Usuário encontrado com esse cpf no banco de dados!', obj: {code: 'NO_FOUND', status: 404}};
            res.json(response.sucess(user, 'user', 'Usuário Retornado.'));
            
        } catch (err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
        
    },
    getUser: async (req, res) => {
        try {
            let decoded = await verifyToken(req);

            let user = await UserDAO.getByCpf(decoded.id.cpf);
            
            res.json(response.sucess(user, 'user', 'Dados do Usuário.'));
            
        } catch (err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },

    login: async (req, res) => {
        const {cpf, password} = req.body;
        try {
            let user = await UserDAO.getByCpf(cpf);
            let expiresIn =  '1 hr';
    
            if (!user) throw {msg: 'Nenhum Usuário encontrado com esse cpf no banco de dados!', obj: {code: 'NO_FOUND', status: 404}}
            
            if(user.password !== password) throw {msg: 'Senha Informada Inválida! Verifique a senha e tente novamente!', obj: {code: 'PASSWORD_INCORRECT', status: 401 }};
                    
            let tokenByCpf = await TokenModel.findOne({where: {cpf_user: cpf}}); 
            if(tokenByCpf) await TokenDAO.delete(tokenByCpf.id);
            
            const token = jwt.sign({ id: {cpf: user.cpf, email: user.email, fullName: user.fulName, role: user.role}}, process.env.SECRET, {expiresIn: expiresIn});
            await TokenDAO.save(cpf, token, expiresIn);
            
            res.json(response.sucess({auth: true, token: token}, 'Token', 'Login Concluido.')); 
        } 
        catch (err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },
    signup: async (req, res) => { // testar nova implemetação 
        const users = req.body;
        let return_users = [];

        try{ 
            if(Array.isArray(users) && users){
                for(let i = 0; i < users.length; i++)
                    return_users.push( await UserDAO.save(users[i].cpf, users[i].password, users[i].fullName, users[i].email, users[i].contact_number, users[i].address, (await isAdmin(req)) ? users[i].role : 'client'));
                if(return_users === 0)  throw {msg: 'Não foi possível válidar os dados inseridos', obj: {code: 'BAD_REQUEST', status: 403 }};
            } 
            else if(users) {
                return_users.push( await UserDAO.save(users.cpf, users.password, users.fullName, users.email, users.contact_number, users.address, (await isAdmin(req)) ? users.role : 'client'));
            }
            else throw {msg: 'Não foi possível válidar os dados inseridos', obj: {code: 'BAD_REQUEST', status: 403 }};
            
            res.json(response.sucess(return_users, 'user', 'Usuário(s) Inserido(s).'));
        }
        catch(err) { 
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }      
    },
};
    // GET /user: Retorna todos os usuários (somente administradores).

    // GET /user/:cpf: Retorna um usuário em específico (somente administradores).

    // PUT /user/:cpf: Atualiza um usuário (somente administradores) ou o próprio usuário.

    // DELETE /user/:cpf: Deleta um usuário (somente administradores).