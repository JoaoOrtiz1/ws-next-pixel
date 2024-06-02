'use strict';
const db = require('../../../config/database/database');
const firebase = require('../../services/firebase/firebase-service');
const auth0 = require('../../services/auth0/auth0-service');

exports.getUsuario = async (id) => {
    try {
        const text = `
            SELECT
                usu_co_usuario,
                usu_no_usuario,
                usu_no_email,
                usu_in_status
            FROM sys_usuario
            WHERE usu_co_usuario = $1
        `
        const values = [id.split('|')[1].replace(/[^\d]/g, '')];
        const result = await db.query(text, values);
        if(result.rows.length > 0){
            result.rows[0].usu_ft_url = await firebase.getFirebaseImage(result.rows[0].usu_co_usuario);
        }
        return result.rows;
    } catch (error) {
        throw error;
    }
}

exports.postUsuario = async (usu_co_usuario, usu_no_usuario, usu_no_email) => {
    try {
        const text = `
            INSERT INTO sys_usuario(
                usu_co_usuario,
                usu_no_usuario,
                usu_no_email,
                usu_in_status
            )
            VALUES(
                $1, $2, $3, 'A'
            )
        `
        const values = [
            usu_co_usuario.split('|')[1].replace(/[^\d]/g, ''),
            usu_no_usuario,
            usu_no_email
        ]

        const result = await db.query(text, values);
        return result;
    } catch (error) {
        throw error;
    }
}

exports.putUser = async  (usu_co_usuario, usu_no_usuario, usu_no_email, usu_in_status, sub) => {
    try {
        const begin = await db.query('begin', []);

        const text = `
            UPDATE sys_usuario SET
                usu_no_usuario = $1,
                usu_no_email = $2,
                usu_in_status = $3
            WHERE usu_co_usuario = $4
        `
        const values = [usu_no_usuario, usu_no_email, usu_in_status, usu_co_usuario];
        const result = await db.query(text, values);

        await auth0.updateUser({usu_no_usuario, usu_no_email, usu_in_status, sub});
        await db.query('commit', []);
        return result;
    } catch (error) {
        const rollback = await db.query('rollback', []);
        throw error;
    }
}