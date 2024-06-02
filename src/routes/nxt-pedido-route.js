const express = require('express');
const router = express.Router();
const controller = require('../controllers/nxt-pedido-controller/nxt-pedido-controller');
const { checkJwt } = require('../services/checkJwt/checkJwt-service');

router.post('', checkJwt, controller.postOrder)


module.exports = router;
