'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/nxt-usuario-controller/nxt-usuario-controller');
const { checkJwt } = require('../services/checkJwt/checkJwt-service');


router.get('/:id', checkJwt, controller.getUsuario);
router.post('', checkJwt, controller.postUsuario);

module.exports = router;
