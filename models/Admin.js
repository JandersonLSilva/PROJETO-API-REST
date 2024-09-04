const { DataType, Op } = require('sequelize');
const sequelize = require('../helpers/db');

// Modelo de Admin
const AdminModel = sequelize.define('Admin', {
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O CPF não deve ser vazio.'
            },
            len: {
                args: [11],
                msg: 'O CPF deve ter exatamente 11 digitos.'
            },
            is: {
                args: /^[0-9]+$/,
                msg: 'O CPF deve ter somente valores numéricos.'
            }
        }
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O Nome não deve ser vazio.'
            },
            len: {
                args: [5, 30],
                msg: 'O Nome deve ter entre 5 e 20 caracteres.'
            },
            is: {
                args: /^[a-b]+$/i,
                msg: 'Não é permitido caracteres além de letras no Nome.'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: {
            msg: 'Insira um endereço de email válido.'
        },
        validate: {
            notEmpty: {
                msg: 'O E-mail não deve ser vazio.'
            }
        }
    },
    contact_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O Número para Contato não deve ser vazio.'
            },
            len: {
                args: [11],
                msg: 'O Número para Contato deve ter exatamente 11 digitos.'
            },
            is: {
                args: /^[0-9]+$/,
                msg: 'O Número para Contato deve ter somente valores numéricos.'
            }
        }
    }
});

module.exports = AdminModel;