'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/nxt-carrinho-controller/nxt-carrinho-controller');
const { checkJwt } = require('../services/checkJwt/checkJwt-service');



router.get('/produtos/itens/auth/:id/:rows/:first/:id_temp', checkJwt, controller.getProdutosCarrinhoAuth);
router.get('/produtos/itens/:id/:rows/:first/:id_temp', controller.getProdutosCarrinho);

router.get('/produtos/quantidade/auth/:id/:id_temp', checkJwt, controller.getQuantidadeProdutosAuth);
router.get('/produtos/quantidade/:id/:id_temp', controller.getQuantidadeProdutos);

router.get('/resumo/auth/:id', checkJwt, controller.getCarrinhoResumoAuth);
router.get('/resumo/:id', controller.getCarrinhoResumo);


router.put('/produtos/quantidade/auth', checkJwt, controller.putQuantidadeProdutoAuth);
router.put('/produtos/quantidade', controller.putQuantidadeProduto);

router.post('/produtos/itens/auth', checkJwt, controller.postProdutoCarrinhoAuth);
router.post('/produtos/itens', controller.postProdutoCarrinho);


router.delete('/produtos/auth/:id/:id_produto', checkJwt, controller.deleteProdutoAuth);
router.delete('/produtos/:id/:id_produto', controller.deleteProduto);


module.exports = router;
