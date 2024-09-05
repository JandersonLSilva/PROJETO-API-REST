const { DataTypes, Op } = require('sequelize');
const AdminModel = require('../models/Admin');

module.exports = {
    list: async () =>{
        return await AdminModel.findAll();
    },
    save: async (cpf, fullName, email, contact_number) =>{
        return await AdminModel.create({
            cpf: cpf, 
            fullName: fullName, 
            email: email, 
            contact_number: contact_number,
        });
    },
    update: async (cpf, fullName, email, contact_number) =>{
        return await AdminModel.update({
            fullName: fullName, 
            email: email, 
            contact_number: contact_number,

        }, {where: {cpf: cpf}});
    },
    delete: async (cpf) =>{
        return await AdminModel.destroy({where: {cpf: cpf}});
    },
    getByCpf: async (cpf) =>{
        return await AdminModel.findByPk(cpf);
    }
};