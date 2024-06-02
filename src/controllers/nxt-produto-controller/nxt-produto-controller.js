'use strict';
const repository = require('../../repositories/nxt-produto-repository/nxt-produto-repository');

exports.getProdutos = async (req, res, next) => {
    try {
        let data = await repository.getProdutos(
            req.body.prod_no_produto,
            req.body.prod_vl_preco_min,
            req.body.prod_vl_preco_max,
            req.body.prod_dt_cadastro_ini,
            req.body.prod_dt_cadastro_fim,
            req.body.prod_in_status,
            req.body.first,
            req.body.rows
        )
        
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}

exports.getProduto = async (req, res, next) => {
    try {
        const data = await repository.getProduto(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}