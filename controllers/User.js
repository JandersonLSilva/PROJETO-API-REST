const response = require('../helpers/response');
const UserDAO = require('../service/UserDAO');
const TokenDAO = require('../service/TokenDAO');
const TokenModel = require('../models/Token');
// const {authenticateToken} = require('../middlewares/authenticateToken');
const jwt = require("jsonwebtoken");

// USERS Controller.
module.exports = {
    // GET /users: Retorna todos os usuários.
    getUsers: async function(req, res) {
        let users = await UserDAO.list();

        if (users.length === 0) res.json(response.fail(
                'Nenhum Usuário encontrado no banco de dados!', 
                {code: 'USERS_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(users, 'user', 'Listando Usuários.'));
    },

    // POST /users: Cria um novo usuário (somente administradores).
    postUser: async function(req, res) {
        const {cpf, password, fullName, email, contact_number, address, role} = req.body;

        UserDAO.save(cpf, password, fullName, email, contact_number, address, role).then(user =>{
            res.json(response.sucess(user, 'user', 'Usuário Inserido.'));
        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });

    },

    // PUT /users/:cpf: Atualiza um usuário.
    putUserByCpf: async function(req, res) {
        const {cpf} = req.params;
        const {fullName, email, contact_number, address} = req.body;

        UserDAO.update(cpf, fullName, email, contact_number, address).then(ret =>{

            if(ret[0] !== 0) UserDAO.getByCpf(cpf)
                .then(user => {res.json(response.sucess(user, 'user', 'Usuário Atualizado.'))})
                .catch(err=>{
                    res.json(response.fail('Erro Inesperado!', err));
                }); 
                
            else res.json(response.fail(
                'Nenhum Usuário encontrado com esse cpf no banco de dados!', 
                {code: 'USER_NOT_FOUND', status: 404})
            );

        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });
    },

    // DELETE /users/:cpf: Deleta um usuário.
    deleteUserByCpf: async function(req, res) {
        const {cpf} = req.params;
        let user;
        UserDAO.getByCpf(cpf).then(userByCpf => {user = userByCpf}).catch(err=>{ res.json(response.fail('Erro Inesperado!', err)) }); 
        let ret = await UserDAO.delete(cpf);

        if (ret !== 1) res.json(response.fail(
            'Nenhum Usuário encontrado com esse cpf no banco de dados!', 
            {code: 'USER_NOT_FOUND', status: 404})
        );
        else res.json(response.sucess(user, 'user', 'Usuário Deletado.'));
        
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
                
                let tokensByCpf = await TokenModel.findAll({where: {cpf_client: cpf}});
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
    signup: async (req, res, next) => {
        if(idAdmin()) next();

        const {cpf, fullName, email, contact_number, address} = req.body;

        UserDAO.save(cpf, fullName, email, contact_number, address, 'client').then(user =>{
            res.json(response.sucess(user, 'Client', 'Cliente Inserido.'));
        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });
    },
    signupAdmin: async (req, res) => {
        
        const {cpf, fullName, email, contact_number, address, role} = req.body;

        UserDAO.save(cpf, fullName, email, contact_number, address, role).then(user =>{
            res.json(response.sucess(user, 'Admin', 'Administrador Inserido.'));
        }).catch(err =>{
            res.json(response.fail('Erro Inesperado!', err));
        });
    }
};
    // GET /user: Retorna todos os usuários (somente administradores).

    // GET /user/:cpf: Retorna um usuário em específico (somente administradores).

    // PUT /user/:cpf: Atualiza um usuário (somente administradores) ou o próprio usuário.

    // DELETE /user/:cpf: Deleta um usuário (somente administradores).