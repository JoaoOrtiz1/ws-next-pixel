'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/nxt-produto-controller/nxt-produto-controller');

router.post('', controller.getProdutos);
router.get('/:id', controller.getProduto);

module.exports = router;
