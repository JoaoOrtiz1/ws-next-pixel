'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/nxt-endereco-controller/nxt-endereco-controller');
const { checkJwt } = require('../services/checkJwt/checkJwt-service');

router.get('/:id/:query', checkJwt,   controller.getEnderecos);

module.exports = router;
