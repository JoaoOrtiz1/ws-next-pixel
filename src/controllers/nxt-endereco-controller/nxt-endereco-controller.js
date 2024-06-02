'use strict';
const repository = require('../../repositories/nxt-endereco-repository/nxt-endereco-repository');

const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');

exports.getEnderecos = async (req, res, next) => {
    try {
        let dataFull = [];
        if(checkUser(req, res, req.params.id)){
            const data = await repository.getEnderecosCarrinho(req.params.id, req.params.query);
            dataFull = await repository.getEnderecosFull(data);
            res.status(200).send(dataFull);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}