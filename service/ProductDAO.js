const { DataTypes, Op } = require('sequelize');
const ProductModel = require('../models/Product');

module.exports = {
    list: async () =>{
        return await ProductModel.findAll();
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