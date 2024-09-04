const { DataType, Op, Sequelize } = require('sequelize');
const sequelize = require('../helpers/db');

const OrderProductModel = sequelize.define('Order_Product', {
    id_product: {
        type: DataTypes.INTEGER,
        reference: {
            model: 'Client',
            key: id,
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    id_order: {
        type: DataTypes.INTEGER,
        reference: {
            model: 'Order',
            key: id,
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    value_unit: {
        type: { args: DataTypes.DOUBLE, msg: "Dados inválido. Preço deve ser numérico."},
        allowNull: false,
        validate: {
            isEmpty: {msg: "O Preço não pode ser vazio."},
            min: {
                args: 0.01,
                msg: "O Preço deve ser positivo."
            }
        }
    }
});

OrderProductModel.belongsToMany('Order', {through: 'Order_Product'});
OrderProductModel.belongsToMany('Product', {through: 'Order_Product'});

module.exports = OrderProductModel;