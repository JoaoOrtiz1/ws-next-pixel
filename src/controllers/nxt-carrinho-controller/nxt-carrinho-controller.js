'use strict';
const repository = require('../../repositories/nxt-carrinho-repository/nxt-carrinho-repository');
const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');

exports.getProdutosCarrinhoAuth = async (req, res, next) => {
    try {       
        if(checkUser(req, res, req.params.id) ){
            const data = await repository.getProdutosCarrinho(req.params.id, req.params.rows, req.params.first, true, req.params.id_temp);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}



exports.getProdutosCarrinho = async (req, res, next) => {
    try {
        const data = await repository.getProdutosCarrinho(req.params.id, req.params.rows, req.params.first, false, req.params.id_temp);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}

exports.deleteProdutoAuth = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.params.id)){
            const data = await repository.deleteProduto(req.params.id, req.params.id_produto, true);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}

exports.deleteProduto = async (req, res, next) => {
    try {
        const data = await repository.deleteProduto(req.params.id, req.params.id_produto, false)
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}

exports.getQuantidadeProdutosAuth = async (req, res, next) => { 
    try {
        if(checkUser(req, res, req.params.id)){
            const data = await repository.getQuantidadeProdutos(req.params.id, true, req.params.id_temp);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}


exports.getQuantidadeProdutos = async (req, res, next) => {
    try {
        const data = await repository.getQuantidadeProdutos(req.params.id_temp, false, req.params.id_temp);
        
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}

exports.putQuantidadeProdutoAuth = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.body.id)){
            const data = await repository.putQuantidadeProduto(req.body.id, req.body.produto, req.body.quantity, true);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}


exports.putQuantidadeProduto = async (req, res, next) => {
    try {
        const data = await repository.putQuantidadeProduto(req.body.id, req.body.produto, req.body.quantity, false);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}

exports.getCarrinhoResumoAuth = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.params.id)){
            const data = await repository.getCarrinhoResumo(req.params.id, true);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}


exports.getCarrinhoResumo = async (req, res, next) => {
    try {
        const data = await repository.getCarrinhoResumo(req.params.id, false);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}

exports.postProdutoCarrinhoAuth = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.body.id)){
            const data = await repository.postProdutoCarrinho(req.body.id, req.body.prod_id, true);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}


exports.postProdutoCarrinho = async (req, res, next) => {
    try {
        const data = await repository.postProdutoCarrinho(req.body.id, req.body.prod_id, false);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}