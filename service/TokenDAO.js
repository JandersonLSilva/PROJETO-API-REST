const { DataTypes, Op } = require('sequelize');
const TokenModel = require('../models/Token');

module.exports = {
    list: async () =>{
        return await TokenModel.findAll();
    },
    save: async (cpf_user, token, expires_at) =>{
        return await TokenModel.create({
            cpf_user: cpf_user,
            token: token,
            expires_at: expires_at
        });
    },
    update: async (id, token, expires_at) =>{
        return await TokenModel.update({
            token: token,
            expires_at: expires_at

        }, {where: {id: id}});
    },
    delete: async (id) =>{
        return await TokenModel.destroy({where: {id: id}});
    },
    getById: async (id) =>{
        return await TokenModel.findByPk(id);
    }
};