'use strict';
const db = require('../../../config/database/database');
const viacep = require('../../services/viacep-service/viacep-service');

exports.getEnderecosCarrinho = async (id, query) => {
    try {
        const text = `
        SELECT    
            endc_co_endereco,
            endc_no_apelido,
            usu_co_usuario,
            endc_co_cep,
            endc_nu_numero
        FROM sys_endereco
        WHERE usu_co_usuario = $1 and upper(endc_no_apelido) like upper($2)
        `
        const values = [
            id,
            `%${query}%`
        ]
        const result = await db.query(text, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

exports.getEndereco = async (id, id_endc) => {
    try {
        const text = `
            SELECT 
                usu_co_usuario,
                endc_co_endereco,
                endc_co_cep,
                endc_co_estado,
                endc_nu_cidade,
                endc_nu_numero,
                endc_no_apelido
            FROM sys_endereco
            WHERE usu_co_usuario = $1 and endc_co_endereco = $2
        `
        const values = [id, id_endc];
        const result = await db.query(text, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

exports.getEnderecos = async (id, first, rows) => {
    try {
        const text = `
            SELECT 
                endc_co_endereco,
                endc_co_cep,
                endc_co_estado,
                endc_nu_cidade,
                endc_nu_numero,
                endc_no_apelido,
                endc_no_bairro,
                endc_no_recebe,
                endc_no_rua,
                count(*) over() as total_records
            FROM sys_endereco
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

exports.getEnderecosFull = async (enderecos) => {
    try {
        let enderecosFull = [];
        for (let i = 0; i < enderecos.length; i++) {
            let enderecoViaCep = await viacep.getEnderecoPorCep(enderecos[i].endc_co_cep);
            enderecosFull.push({
                optionLabel: `${enderecos[i].endc_no_apelido}: ${enderecoViaCep.logradouro}, ${enderecoViaCep.localidade} - ${enderecoViaCep.uf}, ${enderecos[i].endc_nu_numero}`,
                optionValue: `${enderecos[i].endc_co_endereco}|${enderecos[i].usu_co_usuario}`,
                optionLabelSimple: enderecos[i].endc_no_apelido
            })            
        }
        return enderecosFull;
    } catch (error) {
        throw error;
    }
}

exports.deleteEndereco = async (id, id_endc) => {
    try {
        const text = `
            DELETE FROM sys_endereco
            WHERE usu_co_usuario = $1 AND endc_co_endereco = $2
        `
        const values = [id, id_endc];
        const result = await db.query(text, values);
        return;
    } catch (error) {
        throw error;
    }
}

exports.postEndereco = async (id, cep, estado, cidade, numero, apelido, bairro, recebe, rua) => {
    try {
        const text = `
            INSERT INTO sys_endereco (
                endc_co_endereco,
                usu_co_usuario,
                endc_co_cep,
                endc_co_estado,
                endc_nu_cidade,
                endc_nu_numero,
                endc_no_apelido,
                endc_no_bairro,
                endc_no_recebe,
                endc_no_rua
            )
            VALUES(
                (SELECT COALESCE(MAX(endc_co_endereco),0) from sys_endereco)+1,
                $1, $2, $3, $4, $5, $6, $7, $8, $9
            )
            ON CONFLICT DO NOTHING
        `
        const values = [id, cep, estado, cidade, numero, apelido, bairro, recebe, rua];
        const result = await db.query(text, values);
        return result;
    } catch (error) {
        throw error;
    }
}

exports.putEndereco = async(id_endc, id, cep, estado, cidade, numero, apelido, bairro, recebe, rua) => {
    try {
        const text = `
            UPDATE sys_endereco SET
                endc_co_cep = $1,
                endc_co_estado = $2,
                endc_nu_cidade = $3,
                endc_nu_numero = $4,
                endc_no_apelido = $5,
                endc_no_bairro = $6,
                endc_no_recebe = $7,
                endc_no_rua = $8
            WHERE usu_co_usuario = $9 and endc_co_endereco = $10
        `;
        const values = [cep, estado, cidade, numero, apelido, bairro, recebe, rua, id, id_endc];
        const result = await db.query(text, values);
        return result;
    } catch (error) {
        throw error;
    }
}