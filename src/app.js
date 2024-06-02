'use strict'; // Em caso de banco novo basta rodar npx prisma migrate deploy para criar toda estrtura de banco! ou npx prisma db pull para atualizar a estrutura

const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();
require('dotenv').config();
const corsOptions = {
    origin: '**',
}

//Carregue as rotas aqui
const index = require('./routes/index.js');
const produto = require('./routes/nxt-produtos-route.js');
const usuario = require('./routes/nxt-usuario-route.js');
const endereco = require('./routes/nxt-endereco-route.js');
const carrinho = require('./routes/nxt-carrinho-route.js');
const pedido = require('./routes/nxt-pedido-route.js');
const meuPerfil = require('./routes/nxt-meu-perfil-route.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/', index);
app.use('/produtos', produto);
app.use('/usuario', usuario);
app.use('/endereco', endereco);
app.use('/carrinho', carrinho);
app.use('/pedido', pedido);
app.use('/meu-perfil', meuPerfil);

module.exports = app;
