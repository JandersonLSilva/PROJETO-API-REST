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
        type: DataTypes.STRING,
        reference: {
            model: 'Client',
            key: 'cpf',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },

    status: {
        type: DataTypes.STRING,
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
    },

    date_created: {
        type:DataTypes.DATE
    },

    time_created: {
        type: DataTypes.TIME
    },

    date_updated: {
        type: DataTypes.DATE
    },

    time_updated: {
        type: DataTypes.TIME
    }
});

ClientModel.hasMany(OrderModel, { foreignKey: 'cpf_client'});
OrderModel.belongsTo(ClientModel, {
    foreignKey: 'cpf_client',
    as: 'Client'
});

module.exports = OrderModel;