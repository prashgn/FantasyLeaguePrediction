const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env.js');

function getRole(val) {
    return new Promise(async function (resolve, reject) {
        let db; // Declared here for scoping purposes.
        global.gb_roles = '';
        global.gb_details = '';
        if (1 === 1) {
            /* (typeof global.gb_roles === 'undefined' && 
            typeof global.gb_user !== 'undefined') */

            try {
                db = await mysql.createConnection({
                    host: env.HOST,
                    user: env.USER,
                    password: env.PASSWORD,
                    database: env.DATABASE,
                });
                //console.log('Connected to database');
                let result = await db.query('select * from roles where fk_id = ?', [val], function (
                    err,
                    result,
                    fields
                ) {
                    if (err) throw err;
                    if (result.length < 1) {
                        //console.log('Fetch1 - Roles Not Defined');
                    } else {
                        role = result[0].role;
                        global.gb_roles = role;
                        global.gb_details = val + ',' + role;
                    }
                });
            } catch (err) {
                console.log('Error occurred', err);
                reject(err);
            }
        }
    });
}
module.exports.getRole = getRole;