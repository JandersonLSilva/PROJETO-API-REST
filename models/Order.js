const { DataType, Op, Sequelize } = require('sequelize');
const sequelize = require('../helpers/db');

const OrderModel = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    },

    cpf_client: {
        type: DataTypes.INTEGER,
        reference: {
            model: 'client',
            key: id,
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
        type: {args: DataTypes.DOUBLE, msg: 'Dados inválidos. O Valor Total deve ser numérico.'}
    },

    date_created: {
        type: {args: DataTypes.DATA, msg: 'Dados inválidos. Informe um formato de Data válida.'}
    },

    time_created: {
        type: {args: DataTypes.TIME, msg: 'Dados inválidos. Informe um formato de Horário válido.'}
    },

    date_updated: {
        type: {args: DataTypes.DATA, msg: 'Dados inválidos. Informe um formato de Data válida.'}
    },

    time_updated: {
        type: {args: DataTypes.TIME, msg: 'Dados inválidos. Informe um formato de Horário válido.'}
    }
});

OrderModel.belongsTo('Client');

module.exports = OrderModel;