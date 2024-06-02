'use strict';
const db = require('../../../config/database/database');
const firebase = require('../../services/firebase/firebase-service');

exports.getProdutos = async (
    prod_no_produto,
    prod_vl_preco_min,
    prod_vl_preco_max,
    prod_dt_cadastro_ini,
    prod_dt_cadastro_fim,
    prod_in_status,
    first,
    rows,
) => {
    try {
        let text = `
            SELECT 
            COUNT(*) OVER () AS total_records,
            prod_co_produto,
            prod_no_produto,
            prod_url_3d,
            prod_vl_preco,
            prod_path_url_thumbnail
            FROM sys_produto WHERE 1=1
        `
        let countParam = 0;
        let values = [];

        if(prod_no_produto){
            countParam++
            text += ` AND upper(prod_no_produto) like upper( $${countParam})`
            values.push(`%${prod_no_produto}%`);
        }

        if(prod_vl_preco_min){
            countParam++
            text += ` AND prod_vl_preco >= $${countParam}`
            values.push(prod_vl_preco_min);
        }

        if(prod_vl_preco_max){
            countParam++
            text += ` AND prod_vl_preco <= $${countParam}`
            values.push(prod_vl_preco_max);
        }

        if(prod_dt_cadastro_ini){
            countParam++
            text += ` AND prod_dt_cadastro >= $${countParam}`;
            values.push(prod_dt_cadastro_ini)
        }

        if(prod_dt_cadastro_fim){
            countParam++
            text += ` AND prod_dt_cadastro <= $${countParam}`;
            values.push(prod_dt_cadastro_fim)
        }

        if(prod_in_status == 'T'){
            text += ` AND prod_in_status is not null`;
        }else{
            countParam++;
            text += ` AND prod_in_status = $${countParam}`;
            values.push(prod_in_status);
        }

        text += `
            LIMIT $${countParam+1} OFFSET $${countParam+2}
        `
        values.push(rows, first);

        let result = await db.query(text, values);
        for (let i = 0; i < result.rows.length; i++) {
            let thumb = await firebase.getFirebaseImage(result.rows[i].prod_path_url_thumbnail)
            result.rows[i].prod_path_url_thumbnail = thumb;
            result.rows[i].show_iframe = false;
        }
        return result.rows;
    } catch (error) {
        throw error;
    }
}


exports.getProduto = async (id) => {
    try {
        const text = `
            SELECT
                prod_co_produto,
                prod_no_produto,
                prod_vl_preco,
                prod_url_3d,
                prod_tx_descricao
            FROM sys_produto
            WHERE prod_co_produto = $1
        `
        const values = [id];
        const result = await db.query(text, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}