const { DataTypes, Op, Sequelize } = require('sequelize');
const sequelize = require('../helpers/db');
const UserModel = require('./User');

const OrderModel = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },

    cpf_client: {
        type: DataTypes.STRING(11),
        reference: {
            model: 'User',
            key: 'cpf',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },

    status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        validate: {
            notEmpty: {msg: "O Status não pode ser vazio."},

            isIn: {
                args: [['Em Processamento','Confirmado','Em Transito','Entregue','Cancelado']],
                msg: `Só é aceito Status como: 'Em Processamento', 'Confirmado', 'Em Transito', 'Entregue' ou 'Cancelado'`
            }
        }
    },

    total_value: {
        type: DataTypes.DOUBLE
    }
});

UserModel.hasMany(OrderModel, { foreignKey: 'cpf_client'});
OrderModel.belongsTo(UserModel, {
    foreignKey: 'cpf_client',
    as: 'Client'
});

module.exports = OrderModel;