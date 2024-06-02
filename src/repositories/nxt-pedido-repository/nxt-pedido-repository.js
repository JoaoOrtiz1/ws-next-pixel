'use strict';
const db = require('../../../config/database/database');
const carrinhoRepository = require('../nxt-carrinho-repository/nxt-carrinho-repository');

exports.postOrder = async (user, valor, endereco) => {
    try {
        const begin = await db.query('BEGIN', []);
        const nextPedido = await db.query(`SELECT COALESCE(MAX(ped_co_pedido),0)+1 as next_pedido FROM sys_pedido`, []);
        
        const text = `
            INSERT INTO sys_pedido
                (
                    ped_co_pedido,
                    usu_co_usuario,
                    ped_dt_pedido,
                    ped_in_status,
                    ped_vl_pedido,
                    endc_co_endereco
                )
                VALUES(
                    $1, $2, $3, $4, $5, $6
                )
        `
        const values = [nextPedido.rows[0].next_pedido, user, new Date(), 'C', parseFloat(valor), endereco];
        const result = await db.query(text, values);

        const produtosPedido = await setProdutosPedido(user, nextPedido.rows[0].next_pedido);
        const deleteProdutosCarrinho = await carrinhoRepository.deleteProduto(user, 'undefined', true );
        const commit = await db.query('COMMIT', []);
        return result;
    } catch (error) {
        const rollback = await db.query('ROLLBACK', []);
        throw error;
    }
}

const getProdutosCarrinho = async (user) => {
    try {
        const text = `
            SELECT
                carp.prod_co_produto,
                carp.prod_qt_produto
            FROM sys_carrinho_produto carp
            INNER JOIN sys_carrinho car ON carp.car_co_carrinho = car.car_co_carrinho
            WHERE car.usu_co_usuario = $1
        `
        const values = [user];
        const result = await db.query(text, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const setProdutosPedido = async (user, next_pedido) => {
    try {
        const produtosCarrinho = await getProdutosCarrinho(user);
        const text = `
            INSERT INTO sys_pedido_produto(
                ped_co_pedido,
                prod_co_produto,
                prod_qt_produto
            )
            VALUES ($1, $2, $3);
        `
        if(produtosCarrinho){
            for (let i = 0; i < produtosCarrinho.length; i++) {
                const result = await db.query(text, [next_pedido, produtosCarrinho[i].prod_co_produto, produtosCarrinho[i].prod_qt_produto]);
             }
        }
        return;
    } catch (error) {
        throw error;
    }
}

exports.getPedidos = async (id, first, rows) => {
    try {
        const text = `
            SELECT 
                ped_co_pedido,
                ped_in_status,
                ped_dt_pedido,
                ped_vl_pedido,
                endc_co_endereco,
                COUNT (*) OVER () as total_records
            FROM sys_pedido
            WHERE usu_co_usuario = $1
            LIMIT $2 OFFSET $3
        `
        const values = [id, rows, first];
        const result = await db.query(text, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}


exports.getPedidoProduto = async (id, id_pedido, first, rows) => {
    try {
        const text = `
            SELECT 
                prod.prod_co_produto,
                prod.prod_no_produto,
                pedp.prod_qt_produto,
                prod.prod_vl_preco,
                prod.prod_vl_preco*pedp.prod_qt_produto as prod_vl_total,
                COUNT(*) OVER () as total_records
            FROM sys_pedido ped
            INNER JOIN sys_pedido_produto pedp ON ped.ped_co_pedido = pedp.ped_co_pedido
            INNER JOIN sys_produto prod on pedp.prod_co_produto = prod.prod_co_produto
            WHERE ped.ped_co_pedido = $1 and ped.usu_co_usuario = $2
            LIMIT $3 OFFSET $4
            `
        const values = [id_pedido, id, rows, first];
        const result = await db.query(text, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}
