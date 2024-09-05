const { DataTypes, Op } = require('sequelize');
const sequelize = require('../helpers/db');

const ClientModel = sequelize.define('Client', {
    cpf: {
        type: DataTypes.STRING(11),
        primaryKey: true,
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
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O Nome não deve ser vazio.'
            },
            len: {
                args: [5, 30],
                msg: 'O Nome deve ter entre 5 e 30 caracteres.'
            },
            is: {
                args: /^[a-b]+$/i,
                msg: 'Não é permitido caracteres além de letras no Nome.'
            }
        }
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        isEmail: {
            msg: 'Insira um endereço de email válido.'
        },
        validate: {
            notEmpty: {
                msg: 'O E-mail não deve ser vazio.'
            },
            len: {
                args: [10, 30],
                msg: 'Email muito grande! O Email deve ter entre 10 e 30 caracteres.'
            },
        }
    },
    contact_number: {
        type: DataTypes.STRING(11),
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
    },
    address: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O Endereço não deve ser vazio.'
            },
            len: {
                args: [10, 30],
                msg: 'O Endereço deve ter entre 10 e 30 caracteres.'
            },
            is: {
                args: /^[0-9a-z]+$/i,
                msg: 'O Endereço para Contato não deve ter caracteres especiais.'
            }
        }
    }
});

module.exports = ClientModel;