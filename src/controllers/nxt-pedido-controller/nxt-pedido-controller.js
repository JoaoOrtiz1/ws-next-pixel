'use strict';
const repository = require('../../repositories/nxt-pedido-repository/nxt-pedido-repository');
const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');


exports.postOrder = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.body.user)){
            const data = await repository.postOrder(req.body.user, req.body.valor, req.body.selectedEndc);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
    }
}