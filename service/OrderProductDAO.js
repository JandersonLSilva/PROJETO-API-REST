const { DataTypes, Op } = require('sequelize');
const OrderProductModel = require('../models/OrderProduct');

module.exports = {
    list: async (page, limit) =>{
        const offset = (page - 1) * limit;
        return await OrderProductModel.findAll({ offset: offset, limit: Number(limit) });
    },
    save: async (id_order, id_product) =>{
        return await OrderProductModel.create({
            id_product: id_product,
            id_order: id_order
        });
    },
    
    delete: async (id_order) =>{
        return await OrderProductModel.destroy({where: {id_order: id_order}});
    },
    getById: async (id_product, id_order) =>{
        return await OrderProductModel.findByPk(id_order, id_product);
    }
};