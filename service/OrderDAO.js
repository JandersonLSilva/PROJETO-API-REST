const { DataTypes, Op } = require('sequelize');
const OrderModel = require('../models/Order');

module.exports = {
    list: async (page, limit) =>{
        const offset = (page - 1) * limit;
        return await OrderModel.findAll({ offset: offset, limit: Number(limit) });
    },
    save: async (cpf_client, status) =>{
        return await OrderModel.create({
            cpf_client: cpf_client,
            status: status
        });
    },
    update: async (id, status) =>{
        return await OrderModel.update({
            status: status

        }, {where: {id: id}});
    },
    delete: async (id) =>{
        return await OrderModel.destroy({where: {id: id}});
    },
    getById: async (id) =>{
        return await OrderModel.findByPk(id);
    }
};