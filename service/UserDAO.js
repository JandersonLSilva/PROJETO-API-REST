const { Sequelize, DataTypes, Op } = require('sequelize');
const UserModel = require('../models/User');

module.exports = {
    list: async (page, limit) =>{
        let offset = (page && limit) ? ((page - 1) * limit) : null;
        if(offset !== null) return await UserModel.findAll({ offset: offset, limit: Number(limit) });
        else return await UserModel.findAll({ offset: 0, limit: 20 });
    },
    save: async (cpf, password, fullName, email, contact_number, address, role) =>{
        return await UserModel.create({
            cpf: cpf,
            password: password,
            fullName: fullName, 
            email: email, 
            contact_number: contact_number,
            address: address,
            role: role
        });
    },
    update: async (cpf, password, fullName, email, contact_number, address) =>{
        return await UserModel.update({
            fullName: fullName,
            password: password,
            email: email, 
            contact_number: contact_number, 
            address: address

        }, {where: {cpf: cpf}});
    },
    delete: async (cpf) =>{
        return await UserModel.destroy({where: {cpf: cpf}});
    },
    getByCpf: async (cpf) =>{
        return await UserModel.findByPk(cpf);
    }
};