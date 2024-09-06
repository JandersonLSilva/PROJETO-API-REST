const {Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../helpers/db');
const UserModel = require('./User');

const TokenModel = sequelize.define('Token', {
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

    token:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "O token não pode ser vazio."}
        }
    },

    expires_at:{
        type: DataTypes.STRING(5)
    }

});
UserModel.belongsTo(TokenModel, { foreignKey: 'cpf_client'});
TokenModel.belongsTo(UserModel, {
    foreignKey: 'cpf_client',
    as: 'Client'
});
module.exports = TokenModel;