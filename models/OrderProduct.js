const { DataTypes, Op, Sequelize } = require('sequelize');
const sequelize = require('../helpers/db');
const ProductModel = require('../models/Product');
const OrderModel = require('../models/Order');


const OrderProductModel = sequelize.define('Order_Product', {
    id_order: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        reference: {
            model: 'Order',
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        reference: {
            model: 'Product',
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    }
    
});

OrderProductModel.belongsToMany(OrderModel, {through: 'Order_Product'});
OrderProductModel.belongsToMany(ProductModel, {through: 'Order_Product'});

module.exports = OrderProductModel;