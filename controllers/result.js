const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env.js');

const db = mysql.createConnection({
    host: env.HOST,
    user: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE,
    multipleStatements: true,
});

exports.getResult = async (req, res) => {
    try {
        var matchid = req.query.item;
        var resultQuery = 
            'SELECT ' +
            'rule.id AS "ruleid", ' +
            'rule.name AS "rulename", ' +
            'CASE ' +
            'WHEN rule.selection = "player" THEN  ' +
            '(SELECT player.name FROM player WHERE player.id = score.predict_value) ' +
            'WHEN rule.selection = "team" THEN  ' +
            '(SELECT team.name FROM team WHERE team.id = score.predict_value) ' +
            'WHEN rule.selection IS NULL THEN  ' +
            '(score.predict_value) ' +
            'END AS "predictvalue", ' +
            'CASE ' +
            'WHEN rule.selection = "player" THEN  ' +
            '(SELECT player.name FROM player WHERE player.id = result.actual_value) ' +
            'WHEN rule.selection = "team" THEN  ' +
            '(SELECT team.name FROM team WHERE team.id = result.actual_value) ' +
            'WHEN rule.selection IS NULL THEN  ' +
            '(result.actual_value) ' +
            'END AS "resultvalue", ' +
            'score.score_value AS "score" ' +
            'FROM rule ' +
            'INNER JOIN score ON score.fk_u_id = ' +
            req.user + ' ' +
            'AND score.fk_m_id = ' +
            matchid + ' ' +
            'AND score.fk_r_id = rule.id ' +
            'INNER JOIN result ON result.fk_m_id = ' +
            matchid + ' ' +
            'AND result.fk_r_id = rule.id;';

        db.query(resultQuery , function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                res.send(results);
            }
        });
    } catch (error) {
        console.log(error);
    }
};
