const response = require('../helpers/response');
const UserDAO = require('../service/UserDAO');
const TokenDAO = require('../service/TokenDAO');
const TokenModel = require('../models/Token');
const {isAdmin, verifyToken} = require('../middlewares_utils/utils');
const jwt = require("jsonwebtoken");

// USERS Controller.
module.exports = {
    // GET /user/:page/:limit: Retorna todos os usuários (somente administradores).
    getUsers: async function(req, res) {
        // #swagger.summary = 'Lista todas os Usuários.'
        // #swagger.tags = ['Users']
        // #swagger.description = 'Essa rota retorna todos os Usuários de uma página e limite informado, como um objeto JSON (somente administradores).'

       /* #swagger.responses[200] = {
            description: 'Usuário(s) Retornado(s).',
            schema: { $ref: "#/schemas/array_user" }
        }*/
        /* #swagger.responses[404] = {
            "description": "Nenhum Usuário encontrado no banco de dados!"
        }*/

        try{
            let users = await UserDAO.list(req.query.page, req.query.limit);
            
            if (users.length === 0) throw {msg: 'Nenhum Usuário encontrado no banco de dados!', obj: {code: 'NO_FOUND', status: 404}}
            res.json(response.sucess(users, 'user', 'Listando Usuários.', req.query.page, req.query.limit*req.query.page, users.length));
            console.log(users)
        }
        catch(err){
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }

    },

    // PUT /user/:cpf: Atualiza um usuário (somente administradores) ou o próprio usuário.
    putUserByCpf: async function(req, res) {
        // #swagger.summary = 'Atualizar um Usuário.'
        // #swagger.tags = ['Users']
        // #swagger.description = 'Essa rota atualiza um Usuário com base no cpf informado e o retorna, como um objeto JSON (somente administradores) ou o próprio usuário se o cpf informado for igual ao seu.'
        /* #swagger.parameters = {
            name: "body",
            in: "body",
            schema: { $ref: "#/schemas/up_user" }
        }*/
        /* #swagger.responses[200] = {
            description: 'Usuário Atualizado.',
            schema: { $ref: "#/schemas/user" }
        }*/
        /* #swagger.responses[404] = {
            "description": "Nenhum Usuário encontrado com esse cpf no banco de dados!"
        }*/
        
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

    // DELETE /user/:cpf: Deleta um usuário (somente administradores).
    deleteUserByCpf: async function(req, res) {
        // #swagger.summary = 'Deletar um Usuário.'
        // #swagger.tags = ['Users']
        // #swagger.description = 'Essa rota apaga um Usuário com base no cpf informado e o retorna, como um objeto JSON (somente administradores).'

        /* #swagger.responses[200] = {
            description: 'Usuário Deletado.',
            schema: { $ref: "#/schemas/user" }
        }*/
        /* #swagger.responses[404] = {
            "description": "Nenhum Usuário encontrado com esse cpf no banco de dados!"
        }*/

        
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
    
    // GET /user/:cpf: Retorna um usuário em específico (somente administradores).
    getUserByCpf: async function(req, res) {
        // #swagger.summary = 'Listar um Usuário.'
        // #swagger.tags = ['Users']
        // #swagger.description = 'Essa rota retorna um Usuário (como um objeto JSON) em específico com base no cpf informado no parametro da rota (Somente administradores).'

        /* #swagger.responses[200] = {
            description: 'Usuário Retornado.',
            schema: { $ref: "#/schemas/user" }
        }*/
        /* #swagger.responses[404] = {
            "description": "Nenhum Usuário encontrado com esse cpf no banco de dados!"
        }*/

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
        // #swagger.summary = 'Listar o Usuário.'
        // #swagger.tags = ['Users']
        // #swagger.description = 'Essa rota retorna o Usuário com base no token enviado, como um objeto JSON.'

        /* #swagger.responses[200] = {
            description: 'Usuário Retornado.',
            schema: { $ref: "#/schemas/user" }
        }*/

        try {
            let decoded = await verifyToken(req);

            let user = await UserDAO.getByCpf(decoded.id.cpf);
            
            res.json(response.sucess(user, 'user', 'Dados do Usuário.'));
            
        } catch (err) {
            res.json(response.fail(err.msg || "Erro Inesperado!", err.obj || err));
        }
    },

    login: async (req, res) => {
        // #swagger.summary = 'Logar com um Usuário.'
        // #swagger.tags = ['Users']
        // #swagger.description = 'Essa rota permite fazer o login de um Usuário e retorna o token gerado, como um objeto JSON.'
        /* #swagger.parameters = {
            name: "body",
            in: "body",
            schema: { $ref: "#/schemas/login_user" }
        }*/
        /* #swagger.responses[200] = {
            description: 'Login Concluido.',
            schema: { $ref: "#/schemas/token_user" }
        }*/
        /* #swagger.responses[404] = {
            "description": "Nenhum Usuário encontrado com esse cpf no banco de dados!"
        }*/
        /* #swagger.responses[401] = {
            "description": "Senha Informada Inválida! Verifique a senha e tente novamente!"
        }*/

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
    signup: async (req, res) => {
        // #swagger.summary = 'Cadastrar os Usuários.'
        // #swagger.tags = ['Users']
        // #swagger.description = 'Essa rota cadastra um novo Usuário e o retorna, como um objeto JSON.'
        /* #swagger.parameters = {
            name: "body",
            in: "body",
            schema: { $ref: "#/schemas/ins_user" }
        }*/
        /* #swagger.responses[200] = {
            description: 'Usuário(s) Inserido(s).',
            schema: { $ref: "#/schemas/ins_user" }
        }*/
        /* #swagger.responses[403] = {
            "description": "Não foi possível válidar os dados inseridos"
        }*/

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
    adminSignup: async (req, res) => {
        // #swagger.summary = 'Cadastrar os Administradores.'
        // #swagger.tags = ['Users']
        // #swagger.description = 'Essa rota cadastra um novo Administrador e o retorna, como um objeto JSON.'
        /* #swagger.parameters = {
            name: "body",
            in: "body",
            schema: { $ref: "#/schemas/ins_admin" }
        }*/
        /* #swagger.responses[200] = {
            description: 'Usuário(s) Inserido(s).',
            schema: { $ref: "#/schemas/ins_admin" }
        }*/
        /* #swagger.responses[403] = {
            "description": "Não foi possível válidar os dados inseridos"
        }*/

        const users = req.body;
        let return_users = [];

        try{ 
            if(Array.isArray(users) && users){
                for(let i = 0; i < users.length; i++)
                    return_users.push( await UserDAO.save(users[i].cpf, users[i].password, users[i].fullName, users[i].email, users[i].contact_number, users[i].address, 'client'));
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
    }
};


