'use strict';
const repositoryUser = require('../../repositories/nxt-usuario-repository/nxt-usuario-repository');
const repositoryPedido = require('../../repositories/nxt-pedido-repository/nxt-pedido-repository');
const repositoryEndereco = require('../../repositories/nxt-endereco-repository/nxt-endereco-repository');
const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');

exports.putUser = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.body.id)){
            const data = await repositoryUser.putUser(req.body.id, req.body.nome, req.body.email, req.body.status, req.auth.sub);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}

exports.getPedidos = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.params.id)){
            const data = await repositoryPedido.getPedidos(req.params.id, req.params.first, req.params.rows);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}

exports.getPedidoProduto = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.params.id)){
            let data = await repositoryPedido.getPedidoProduto(req.params.id, req.params.id_pedido, req.params.first, req.params.rows);
            const endc = await repositoryEndereco.getEndereco(req.params.id, req.params.id_endc);
            const endcFull = await repositoryEndereco.getEnderecosFull(endc);
            data[0].endc = endcFull[0].optionLabel;
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}

exports.getEnderecos = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.params.id)){
            const data = await repositoryEndereco.getEnderecos(req.params.id, req.params.first, req.params.rows);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}

exports.deleteEndereco = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.params.id)){
            const data = await repositoryEndereco.deleteEndereco(req.params.id, req.params.id_endc);
            res.status(200).send(data);
        }
    } catch (error) {

        res.status(500).send({
            error: error,
            message: error.code == 23503? 'Endereço relacionado a um pedido existente! Tente altera-lo ou criar outro.' : error.message
        })
    }
}

exports.postEndereco = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.body.id)){
            const data = await repositoryEndereco.postEndereco(
                req.body.id,
                req.body.cep,
                req.body.estado,
                req.body.cidade,
                req.body.numero,
                req.body.apelido,
                req.body.bairro,
                req.body.recebe,
                req.body.rua
            );
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}

exports.putEndereco = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.body.id)){
            const data = await repositoryEndereco.putEndereco(
                req.body.id_endc,
                req.body.id,
                req.body.cep,
                req.body.estado,
                req.body.cidade,
                req.body.numero,
                req.body.apelido,
                req.body.bairro,
                req.body.recebe,
                req.body.rua
            )
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}
