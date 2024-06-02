'use strict';
const db = require('../../../config/database/database');
const firebase = require('../../services/firebase/firebase-service');

exports.getProdutosCarrinho = async (id, rows, first, isAuthenticated, id_temp) => {
    try {
        if(isAuthenticated){
            await syncCarrinho(id, id_temp);
        }
        const text = `
        SELECT
            prod.prod_no_produto,
            prod.prod_co_produto,
            scp.prod_qt_produto,
            prod.prod_vl_preco,
            prod.prod_url_3d,
            prod.prod_path_url_thumbnail,
            COUNT(*) OVER () AS total_records
        FROM sys_carrinho cr
        INNER JOIN sys_carrinho_produto scp ON cr.car_co_carrinho = scp.car_co_carrinho
        INNER JOIN sys_produto prod ON scp.prod_co_produto = prod.prod_co_produto
        LEFT JOIN sys_usuario usu ON cr.usu_co_usuario = usu.usu_co_usuario
        WHERE ${isAuthenticated? 'usu.usu_co_usuario': 'cr.car_co_temp_id'} = $1
        LIMIT $2 OFFSET $3
        `
        const values = [id, rows, first]
        const result = await db.query(text, values);
        if(result && result.rows){
            for (let i = 0; i < result.rows.length; i++) {
                let thumb = await firebase.getFirebaseImage(result.rows[i].prod_path_url_thumbnail)
                result.rows[i].prod_path_url_thumbnail = thumb;
                result.rows[i].show_iframe = false;
            }
            return result.rows;
        }
        return []
    } catch (error) {
        throw error;
    }
}


exports.deleteProduto = async (id, id_produto, isAuthenticated) => { 
    try {
        let text = `
            DELETE FROM sys_carrinho_produto 
            WHERE car_co_carrinho = (
                SELECT car_co_carrinho
                FROM sys_carrinho
                WHERE ${isAuthenticated ? 'usu_co_usuario' : 'car_co_temp_id'} = $1
            )

        `
        let values = [id]

        if(id_produto !== 'undefined'){
            text+=` and prod_co_produto = $2`; 
            values.push(id_produto);
        }
        const result = await db.query(text, values);
        return;
    } catch (error) {
        throw error;
    }
}

exports.getQuantidadeProdutos = async (id, isAuthenticated, id_temp) => {
    try {
        const carrinhoId = await getCarrinho(id, true);
        const carrinhoTemp = await getCarrinho(id_temp, false);
        if(carrinhoId.length == 0 && isAuthenticated){
            const create = await createCarrinho(id, true);
        }
        if(carrinhoTemp.length == 0){
            const create = await createCarrinho(id, isAuthenticated);
        }
        if(isAuthenticated){
            await syncCarrinho(id, id_temp);
        }


        let total_produtos = await getQuantidadeProdutosVerify(id, isAuthenticated);
        return total_produtos;
    } catch (error) {
        throw error;
    }
}

const getQuantidadeProdutosVerify = async (id, isAuthenticated) => {
    try {
        const text = `
            SELECT COUNT(*) as total_records
            FROM sys_carrinho_produto cpr
            INNER JOIN sys_carrinho cr on cpr.car_co_carrinho = cr.car_co_carrinho
            WHERE ${isAuthenticated ? 'cr.usu_co_usuario' : 'cr.car_co_temp_id'} = $1
           

        `
        const values = [id];
        const result = await db.query(text, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const getCarrinho = async (id, isAuthenticated) => {
    try {
        let textCarrinho = `
            SELECT car_co_carrinho 
            FROM sys_carrinho
            WHERE ${isAuthenticated ?  'usu_co_usuario' : 'car_co_temp_id'} = $1
        `
        const valuesCarrinho = [id];
        const resultCarrinho = await db.query(textCarrinho, valuesCarrinho);
        return resultCarrinho.rows;
    } catch (error) {
        throw error;
    }
}

const createCarrinho = async (id, isAuthenticated) => {
    try {
        const text = `
            INSERT INTO sys_carrinho(car_co_carrinho, ${isAuthenticated ? 'usu_co_usuario' : 'car_co_temp_id'})
            VALUES (
                (SELECT COALESCE(max(car_co_carrinho), 0) from sys_carrinho)+1,
                $1
            )
        `
        const values = [id];
        const result = await db.query(text, values);
        return;
    } catch (error) {
        throw error;
    }
}

const syncCarrinho = async (id, id_temp) => {
    try {
        const id_carrinho = await verifyCarrinhoAuth(id);
        const textSync = `
            UPDATE sys_carrinho_produto set
                car_co_carrinho = $1
            WHERE car_co_carrinho = (
                SELECT car_co_carrinho
                FROM sys_carrinho
                WHERE car_co_temp_id = $2
            )  AND NOT EXISTS (
                SELECT 1
                FROM sys_carrinho_produto AS scp
                WHERE scp.car_co_carrinho = $1
                  AND scp.prod_co_produto = sys_carrinho_produto.prod_co_produto
            );
        `
        if(id_carrinho){
            const valuesSync = [id_carrinho[0].car_co_carrinho, id_temp];
            const resultAsync = await db.query(textSync, valuesSync);
        }
        

        const textDelete = `
            DELETE FROM sys_carrinho_produto
            WHERE car_co_carrinho = (
                SELECT car_co_carrinho 
                FROM sys_carrinho
                WHERE car_co_temp_id = $1
            )
        `
        const valuesDelete = [id_temp];
        const resultDelete = await db.query(textDelete, valuesDelete);

    } catch (error) {
        throw error;
    }
}

const setProdutosCarrinho = async (id_temp, car_co_carrinho) => {
    try {
        const text = `
        UPDATE sys_carrinho_produto 
        SET car_co_carrinho = $1
        WHERE car_co_carrinho = (
            SELECT car_co_carrinho
            FROM sys_carrinho 
            WHERE car_co_temp_id = $2 
            AND usu_co_usuario IS NULL
        )
        AND NOT EXISTS (
            SELECT 1
            FROM sys_carrinho_produto
            WHERE car_co_carrinho = $1
              AND prod_co_produto = sys_carrinho_produto.prod_co_produto
        );        
        `
        const values = [car_co_carrinho, id_temp]
        const result = await db.query(text, values);
        return
    } catch (error) {
        throw error;
    }
}

const verifyCarrinhoAuth = async (id) => {
    try {
        const text = `
            SELECT
                car_co_carrinho
            FROM sys_carrinho
            WHERE usu_co_usuario = $1
        `
        const values = [id];
        const result = await db.query(text, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

exports.putQuantidadeProduto = async (user, produto, quantidade, isAuthenticated) => {
    try {
        const text = `
            UPDATE sys_carrinho_produto
            SET prod_qt_produto = $1
            WHERE car_co_carrinho =  (
                SELECT car_co_carrinho
                FROM sys_carrinho
                WHERE  ${isAuthenticated ? 'usu_co_usuario' : 'car_co_temp_id'} = $2
            )
            AND prod_co_produto = $3
        `
        const values = [quantidade, user, produto];
        const result = await db.query(text, values);
        return result;
    } catch (error) {
        throw error;
    }
}

exports.getCarrinhoResumo = async(id, isAuthenticated) => {
    try {
        const text = `
        SELECT 
            SUM(
                COALESCE(prod.prod_vl_preco*crp.prod_qt_produto, 0)
            ) as total_carrinho
        FROM sys_carrinho cr
        INNER JOIN sys_carrinho_produto crp ON cr.car_co_carrinho = crp.car_co_carrinho
        LEFT JOIN sys_produto prod ON crp.prod_co_produto = prod.prod_co_produto
        WHERE ${isAuthenticated ? ' cr.usu_co_usuario' : ' cr.car_co_temp_id'} = $1
        `
        const values = [id];
        const result = await db.query(text, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

exports.postProdutoCarrinho = async (id, prod_id, isAuthenticated) => {
    try {
        const text = `
        INSERT INTO sys_carrinho_produto(
            car_co_carrinho,
            prod_co_produto,
            prod_qt_produto
        )
        VALUES(
            (SELECT car_co_carrinho FROM sys_carrinho WHERE ${isAuthenticated ? 'usu_co_usuario =' : 'car_co_temp_id = '} $1),
            $2,
            1
        )
        ON CONFLICT (car_co_carrinho, prod_co_produto)
        DO UPDATE SET
            prod_qt_produto = sys_carrinho_produto.prod_qt_produto + 1;
        
        `
        const values = [id, prod_id];
        const result = await db.query(text, values);
        return result;
    } catch (error) {
        throw error;
    }
}