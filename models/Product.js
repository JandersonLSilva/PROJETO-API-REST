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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmpty: {msg: "O Nome não pode ser vazio."},
            len: {
                args: [3, 20],
                msg: "O Nome deve ter entre 3 e 20 caracteres."
            }

        }
    },

    description:{
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isEmpty: {msg: "A Descrição não pode ser vazio."},
            len: {
                args: [50, 400],
                msg: "A Descrição deve ter entre 50 e 400 caracteres."
            }

        }
    },

    value:{
        type: { args: DataTypes.DOUBLE, msg: "Dados inválido. Preço deve ser numérico."},
        allowNull: false,
        validate: {
            isEmpty: {msg: "O Preço não pode ser vazio."},
            min: {
                args: 0.01,
                msg: "O Preço deve ser positivo."
            }

        }
    },

    category:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmpty: {msg: "A Categoria não pode ser vazio."},
            len: {
                args: [3, 16],
                msg: "A Categoria deve ter entre 50 e 400 caracteres."
            }

        }
    },

    quantity:{
        type: { args: DataTypes.INTEGER, msg: "Dados inválido. Quantidade deve ser inteiro."},
        allowNull: false,
        validate: {
            isEmpty: {msg: "A Quantidade não pode ser vazio."},
            min: {
                args: 0,
                msg: "A Quantidade não pode ser negativo."
            }

        }
    }

});

module.exports = ProductModel;