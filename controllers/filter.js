const express = require('express');
const response = require('../helpers/response');
const OrderModel = require('../models/Order');
const ProductModel = require('../models/Product');
const UserModel = require('../models/User');

module.exports.indexFilter = async (req, res) => 
    {
        try{
            let products = [];

            products = (req.query.name) ? await this.searchByProperty(res, 'name', req.query.name) : []
            
            if(products.lenght === 0) products = (req.query.category) ? await this.searchByProperty(res, 'category', req.query.category) : []
            else {
                let categorys = (req.query.category) ? await this.searchByProperty(res, 'category', req.query.category) : null; 
                if(categorys){
                    products = products.filter(product => {
                        return categorys.some(category => product.id === category.id);
                    })
                }
            }
            
            if(products.lenght === 0) products = (req.query.description) ? await this.searchByProperty(res, 'description', req.query.description) : []
            else {
                let descriptions = (req.query.description) ? await this.searchByProperty(res, 'category', req.query.description) : null; 
                if(descriptions){
                    products = products.filter(product => {
                        return descriptions.some(description => product.id === description.id);
                    })
                }
            }

            if(products.lenght === 0) throw {msg: "Nenhum Produto encontrado!", obj: {code: "NO_FOUND", status: 404}};


            res.json(response.sucess({products}, 'Products', 'Listando Produtos.'));
        }
        catch (err) {
            console.log(err)
            res.json(response.fail(err.msg || 'Erro Inesperado!', err.obj || err));
        }

    }

module.exports.searchByProperty = async(res, name, property) => 
    {
        let return_products = [];
        try{
            let products = await ProductModel.findAll();
            if(products.lenght === 0) throw {msg: "Não foi encontado nenhum Produto no banco de dados!", obj: {code: "NO_FOUND", status: 404}};

            property = property.normalize("NFD").toLowerCase().replace(/[^\u0061-\u007a0-9\s]/g, "").trim().split(" ");

            products.forEach(product => {
                let ret = product.dataValues[`${name}`].normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "");
                property.forEach(property => {
                    if(ret.includes(property)){
                        return_products.push(product);
                        return;
                    }
                });

            });

            return return_products;
        }
        catch(err){
            console.log(err)
            res.json(response.fail(err.msg || 'Erro Inesperado!', err.obj || err));
        }
    }