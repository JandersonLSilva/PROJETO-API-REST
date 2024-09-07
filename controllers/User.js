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
        let users = await UserDAO.list(page, limit);

        if (users.length === 0) res.json(response.fail(
                'Nenhum Usuário encontrado no banco de dados!', 
                {code: 'USERS_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(users, 'user', 'Listando Usuários.', page, limit, users.length));
    },

    // PUT /users/:cpf: Atualiza um usuário.
    putUserByCpf: async function(req, res) {
        const {cpf} = req.params;
        let return_users;
        try{
            if(isAdmin(req, res)){
            }
            else{
                if(cpf == verifyToken(req).id.cpf) {
                    return_users = await UserDAO.update(cpf, password, fullName, email, contact_number, address, 'client');
                } 
                else res.json(response.fail('O CPF digitado não bate com o cadastrado')) 
            }
        }
        catch(err) { 
            res.json(response.fail(err.errors[0].message, err))
        };

        if(return_users.length !== 0) res.json(response.sucess(return_users, 'user', 'Usuário(s) Inserido(s).'));
        else res.json(response.fail('Dados inválidos! '));
    },

    // DELETE /users/:cpf: Deleta um usuário.
    deleteUserByCpf: async function(req, res) {
        const {cpf} = req.params;

        let UserByCpf = await UserDAO.getByCpf(cpf);

        let ret = await UserDAO.delete(cpf);

        if (ret !== 1) res.json(response.fail(
            'Nenhum Usuário encontrado com esse cpf no banco de dados!', 
            {code: 'USER_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(UserByCpf, 'user', 'Usuário Deletado.'));
        
    },
    
    // GET /users/:cpf: Retorna um usuário em específico.
    getUserByCpf: async function(req, res) {
        const {cpf} = req.params;
        let user = await UserDAO.getByCpf(cpf);

        if (!user) res.json(response.fail(
            'Nenhum Usuário encontrado com esse cpf no banco de dados!', 
            {code: 'USER_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(user, 'user', 'Usuário Retornado.'));
        
    },

    login: async (req, res) => {
        const {cpf, password} = req.body;
        let user = await UserDAO.getByCpf(cpf);
        let expiresIn =  '1 hr';

        if (!user) res.json(response.fail(
            'Nenhum Usuário encontrado com esse cpf no banco de dados!', 
            {code: 'USER_NOT_FOUND', status: 404})
        );
        else {
            if(user.password === password){
                
                let tokensByCpf = await TokenModel.findAll({where: {cpf_user: cpf}});
                tokensByCpf.forEach(tokenByCpf => {
                    TokenDAO.delete(tokenByCpf.id);
                });
                
                const token = jwt.sign({ id: {cpf: user.cpf, email: user.email, fullName: user.fulName, role: user.role}}, process.env.SECRET, {expiresIn: expiresIn});
                await TokenDAO.save(cpf, token, expiresIn);
                res.json(response.sucess({auth: true, token: token}, 'Token', 'Login Concluido.'));
            }
            else res.json(response.fail('Senha Informada Inválida!', {code: 'USER_PASSWORD_INCORRECT', msg: "Verifique a senha e tente novamente!" }));
        }
    },
    signup: async (req, res) => {
        const users = req.body;
        let return_users = [];;

        try{   
            for(let i = 0; i < users.length; i++){
                return_users.push( await UserDAO.save(users[i].cpf, users[i].password, users[i].fullName, users[i].email, users[i].contact_number, users[i].address, 'client'));
            }
            if((return_users.length === 0) && users){
                return_users.push(await UserDAO.save(users.cpf, users.password, users.fullName, users.email, users.contact_number, users.address, 'client'));
            }
        }
        catch(err) { 
            res.json(response.fail('Inserção de forma inválida dos dados!', err)); return;
        };
            
        if(return_users.length !== 0) res.json(response.sucess(return_users, 'user', 'Usuário(s) Inserido(s).'));
        else res.json(response.fail('Inserção de forma inválida dos dados!'));
    },

    signupAdmin: async (req, res) => {
        const users = req.body;
        let return_users = [];;

        try{   
            for(let i = 0; i < users.length; i++){
                return_users.push( await UserDAO.save(users[i].cpf, users[i].password, users[i].fullName, users[i].email, users[i].contact_number, users[i].address, users[i].role));
            }
            if((return_users.length === 0) && users){
                return_users.push(await UserDAO.save(users.cpf, users.password, users.fullName, users.email, users.contact_number, users.address, users.role));
            }
        }
        catch(err) { 
            res.json(response.fail('Inserção de forma inválida dos dados!', err)); return;
        };
            
        if(return_users.length !== 0) res.json(response.sucess(return_users, 'user', 'Administrador(s) Inserido(s).'));
        else res.json(response.fail('Inserção de forma inválida dos dados!'));
    }
};
    // GET /user: Retorna todos os usuários (somente administradores).

    // GET /user/:cpf: Retorna um usuário em específico (somente administradores).

    // PUT /user/:cpf: Atualiza um usuário (somente administradores) ou o próprio usuário.

    // DELETE /user/:cpf: Deleta um usuário (somente administradores).