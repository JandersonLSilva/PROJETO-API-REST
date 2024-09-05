const { DataTypes, Op } = require('sequelize');
const OrderProductModel = require('../models/OrderProduct');

module.exports = {
    list: async () =>{
        return await OrderProductModel.findAll();
    },
    save: async (id_product, id_order, value_unit) =>{
        return await OrderProductModel.create({
            id_product: id_product,
            id_order: id_order,
            value_unit: value_unit
        });
    },
    update: async (id_product, id_order, value_unit) =>{
        return await OrderProductModel.update({
            value_unit: value_unit

        }, {where: {id: id}});
    },
    delete: async (id) =>{
        return await OrderProductModel.destroy({where: {id: id}});
    },
    getById: async (id) =>{
        return await OrderProductModel.findByPk(id);
    }
};