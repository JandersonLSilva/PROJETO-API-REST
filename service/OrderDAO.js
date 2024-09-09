const { DataTypes, Op } = require('sequelize');
const OrderModel = require('../models/Order');

module.exports = {
    list: async (page, limit, cpf) =>{
        const offset = (page - 1) * limit;
        return (cpf) ? await OrderModel.findAll({ offset: offset, limit: Number(limit), where: {cpf_user: cpf} }) 
                     : await OrderModel.findAll({ offset: offset, limit: Number(limit) });
        
    },
    save: async (cpf_user, status, total_value) =>{
        return await OrderModel.create({
            cpf_user: cpf_user,
            status: status,
            total_value: total_value
        });
    },
    update: async (id, status, total_value) =>{
        return await OrderModel.update({
            status: status,
            total_value: total_value

        }, {where: {id: id}});
    },
    delete: async (id) =>{
        return await OrderModel.destroy({where: {id: id}});
    },
    getById: async (id) =>{
        return await OrderModel.findByPk(id);
    }
};