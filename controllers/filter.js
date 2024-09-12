const express = require('express');
const response = require('../helpers/response');
const ProductModel = require('../models/Product');
const OrderModel = require('../models/Order');

module.exports.indexFilter = async (req, res) => 
{
    // #swagger.summary = 'Filtra Produtos.'
    // #swagger.tags = ['Products']
    // #swagger.description = 'Essa rota filtra os produtos com base na categoria, descrição ou name e os retorna, como um objeto JSON.'
    /* #swagger.responses[200] = {
        description: 'Listando Produtos.',
        schema: { $ref: "#/schemas/array_product" }
    }*/
    /* #swagger.responses[404] = {
        "description": "Nenhum Produto encontrado!"
    }*/
    try{
        let products = [];

        products = (req.query.name) ? await this.searchByProperty(res, 'name', req.query.name) : []

        if(products.length === 0) products = (req.query.category) ? await this.searchByProperty(res, 'category', req.query.category) : []
        else {
            let categorys = (req.query.category) ? await this.searchByProperty(res, 'category', req.query.category) : null; 
            if(categorys){
                products = products.filter(product => {
                    return categorys.some(category => product.id === category.id);
                })
            }
        }
        
        if(products.length === 0) products = (req.query.description) ? await this.searchByProperty(res, 'description', req.query.description) : []
        else {
            let descriptions = (req.query.description) ? await this.searchByProperty(res, 'description', req.query.description) : null; 
            if(descriptions){
                products = products.filter(product => {
                    return descriptions.some(description => product.id === description.id);
                })
            }
        }

        if(products.length === 0) throw {msg: "Nenhum Produto encontrado!", obj: {code: "NO_FOUND", status: 404}};


        res.json(response.sucess({products}, 'Products', 'Listando Produtos.'));
    }
    catch (err) {
        res.json(response.fail(err.msg || 'Erro Inesperado!', err.obj || err));
    }

}

module.exports.searchByProperty = async(res, name, property) => {
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
        res.json(response.fail(err.msg || 'Erro Inesperado!', err.obj || err));
    }
}

module.exports.statusFilter = async(req, res) => {
    // #swagger.summary = 'Filtra Pedidos.'
    // #swagger.tags = ['Orders']
    // #swagger.description = 'Essa rota filtra os pedidos com base no status e os retorna, como um objeto JSON.'
    /* #swagger.responses[200] = {
        description: 'Listando Pedidos.',
        schema: { $ref: "#/schemas/array_order" }
    }*/
    /* #swagger.responses[404] = {
        "description": "Nenhum Pedido encontrado!"
    }*/

    let status = req.params.status
    let return_products = [];
    
    try{
        if(!status) throw {msg: "Deve ser informado um filtro de status", obj: {code: "BAD_REQUEST", status: 403}}
        
        let orders = await OrderModel.findAll();
        if(orders.lenght === 0) throw {msg: "Não foi encontado nenhum Pedido no banco de dados!", obj: {code: "NO_FOUND", status: 404}};

        status = status.normalize("NFD").toLowerCase().replace(/[^\u0061-\u007a0-9\s]/g, "").trim().split(" ");

        orders.forEach(order => {
            let ret = order.dataValues.status.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "");
            status.forEach(status => {
                if(ret.includes(status)){
                    return_products.push(order);
                    return;
                }
            });

        });

        res.json(response.sucess({return_products}, 'Products', 'Filtrando Produtos.'));
        
    }
    catch(err){
        res.json(response.fail(err.msg || 'Erro Inesperado!', err.obj || err));
    }
}