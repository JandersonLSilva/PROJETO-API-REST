const { DataTypes, Op } = require('sequelize');
const ProductModel = require('../models/Product');

module.exports = {
    list: async (page, limit) =>{
        let offset = (page && limit) ? ((page - 1) * limit) : null;
        if(offset !== null) return await ProductModel.findAll({ offset: offset, limit: Number(limit) });
        else return await ProductModel.findAll({ offset: 0, limit: 20 });
    },
    save: async (name, description, value, category, quantity) =>{
        return await ProductModel.create({
            name: name,
            description: description,
            value: value,
            category: category,
            quantity: quantity
        });
    },
    update: async (id, name, description, value, category, quantity) =>{

        return await ProductModel.update({
            name: name,
            description: description,
            value: value,
            category: category,
            quantity: quantity
            
        }, {where: {id: id}});
    },
    delete: async (id) =>{
        return await ProductModel.destroy({where: {id: id}});
    },
    getById: async (id) =>{
        return await ProductModel.findByPk(id);
    }
};