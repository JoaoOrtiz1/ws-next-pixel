const express = require('express');
const router = express.Router();
const controller = require('../controllers/nxt-meu-perfil-controller/nxt-meu-perfil-controller');
const { checkJwt } = require('../services/checkJwt/checkJwt-service');

router.put('/', checkJwt, controller.putUser);

router.get('/pedidos/:id/:first/:rows', checkJwt, controller.getPedidos);
router.get('/pedido/:id/:id_pedido/:id_endc/:first/:rows', checkJwt, controller.getPedidoProduto);
router.get('/endereco/:id/:first/:rows', checkJwt, controller.getEnderecos);

router.delete('/endereco/:id/:id_endc', checkJwt, controller.deleteEndereco);

router.post('/endereco', checkJwt, controller.postEndereco);

router.put('/endereco', checkJwt, controller.putEndereco);

module.exports = router;
