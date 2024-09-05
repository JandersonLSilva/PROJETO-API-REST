const { DataTypes, Op, Sequelize } = require('sequelize');
const sequelize = require('../helpers/db');
const ClientModel = require('../models/Client');

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
            model: 'Client',
            key: 'cpf',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },

    status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        validate: {
            isEmpty: {msg: "O Status não pode ser vazio."},

            in: {
                args: ['Em Processamento','Confirmado','Em Transito','Entregue','Cancelado'],
                msg: `Só é aceito Status como: 'Em Processamento', 'Confirmado', 'Em Transito', 'Entregue' ou 'Cancelado'`
            }
        }
    },

    total_value: {
        type: DataTypes.DOUBLE
    }
});

ClientModel.hasMany(OrderModel, { foreignKey: 'cpf_client'});
OrderModel.belongsTo(ClientModel, {
    foreignKey: 'cpf_client',
    as: 'Client'
});

module.exports = OrderModel;