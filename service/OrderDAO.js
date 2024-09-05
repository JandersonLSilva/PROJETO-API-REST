const { DataTypes, Op } = require('sequelize');
const OrderModel = require('../models/Order');

module.exports = {
    list: async () =>{
        return await OrderModel.findAll();
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