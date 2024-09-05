const { DataTypes, Op } = require('sequelize');
const ClientModel = require('../models/Client');

module.exports = {
    list: async () =>{
        return await ClientModel.findAll();
    },
    save: async (cpf, fullName, email, contact_number, address) =>{
        return await ClientModel.create({
            cpf: cpf, 
            fullName: fullName, 
            email: email, 
            contact_number: contact_number, 
            address: address
        });
    },
    update: async (cpf, fullName, email, contact_number, address) =>{
        return await ClientModel.update({
            fullName: fullName, 
            email: email, 
            contact_number: contact_number, 
            address: address

        }, {where: {cpf: cpf}});
    },
    delete: async (cpf) =>{
        return await ClientModel.destroy({where: {cpf: cpf}});
    },
    getByCpf: async (cpf) =>{
        return await ClientModel.findByPk(cpf);
    }
};