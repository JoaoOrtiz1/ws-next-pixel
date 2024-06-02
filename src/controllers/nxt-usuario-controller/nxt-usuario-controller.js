'use strict';
const repository = require('../../repositories/nxt-usuario-repository/nxt-usuario-repository');
const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');


exports.getUsuario = async (req, res, next) => {
    try {
       if(checkUser(req, res, req.params.id.split('|')[1].replace(/[^\d]/g, ''))){
            const data = await repository.getUsuario(req.params.id);
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        })
    }
}

exports.postUsuario = async (req, res, next) => {
    try {
        if(checkUser(req, res, req.body.user.sub.split('|')[1].replace(/[^\d]/g, ''))){
            const data = await repository.postUsuario(
                req.body.user.sub, 
                req.body.user.nickname, 
                req.body.user.email
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