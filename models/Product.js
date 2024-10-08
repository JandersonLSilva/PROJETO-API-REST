const { DataTypes, Op } = require('sequelize');
const sequelize = require('../helpers/db');

const ProductModel = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },

    name:{
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: {msg: "O Nome não pode ser vazio."},
            len: {
                args: [3, 20],
                msg: "O Nome deve ter entre 3 e 20 caracteres."
            }

        }
    },

    description:{
        type: DataTypes.STRING(400),
        allowNull: false,
        validate: {
            notEmpty: {msg: "A Descrição não pode ser vazio."},
            len: {
                args: [50, 400],
                msg: "A Descrição deve ter entre 50 e 400 caracteres."
            }

        }
    },

    value:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "O Preço deve ser positivo."
            }

        }
    },

    category:{
        type: DataTypes.STRING(16),
        allowNull: false,
        validate: {
            notEmpty: {msg: "A Categoria não pode ser vazio."},
            len: {
                args: [3, 16],
                msg: "A Categoria deve ter entre 3 e 16 caracteres."
            }

        }
    },

    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "A Quantidade não pode ser negativo."
            }

        }
    }

});

module.exports = ProductModel;