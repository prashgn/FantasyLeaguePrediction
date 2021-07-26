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

exports.predict = async (req, res) => {
    try {
        var matchid = req.query.item;
        var predictQuery =
            'SELECT * FROM predict WHERE predict.fk_m_id = ' +
            matchid +
            ' AND predict.fk_u_id = ' +
            req.user +
            ';';
        var rulesQuery = 'SELECT * FROM rule;';
        var playerDetQuery =
            'SELECT playerA.id as "playerid", ' +
            'playerA.name as "playername", ' +
            'teamA.id as "teamid", ' +
            'teamA.name as "teamname" FROM match_det ' +
            'INNER JOIN teammember teammemA ON teammemA.fk_teamid = match_det.fk_team_A ' +
            'INNER JOIN player playerA ON playerA.id = teammemA.fk_playerid ' +
            'INNER JOIN team teamA ON teamA.id = match_det.fk_team_A where match_det.id = ' +
            matchid +
            ' ' +
            'AND teammemA.active = true ' +
            'UNION select playerA.id as "playerid", ' +
            'playerA.name as "playername", ' +
            'teamA.id as "teamid", ' +
            'teamA.name as "teamname" FROM match_det ' +
            'INNER JOIN teammember teammemA ON teammemA.fk_teamid = match_det.fk_team_B ' +
            'INNER JOIN player playerA ON playerA.id = teammemA.fk_playerid ' +
            'INNER JOIN team teamA ON teamA.id = match_det.fk_team_B where match_det.id = ' +
            matchid +
            ' ' +
            'AND teammemA.active = true ' +
            'ORDER BY teamid, playername;';
        db.query(predictQuery + rulesQuery + playerDetQuery, function (error, results, fields) {
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

exports.postpredict = async (req, res) => {
    try {
        var result = req.body;
        var matchid;
        for (item in result) {
            if (item == 'matchid') {
                matchid = result[item];
            }
        }

        var sqlQuery = '';
        for (item in result) {
            if (item.match(/rule/i)) {
                var ruleid = item.replace('rule', '');
                var lvi_tmp = result[item];
                
                if ((lvi_tmp >= 0) && (lvi_tmp != '')) {
                sqlQuery =
                    sqlQuery +
                    'INSERT INTO predict (fk_u_id,fk_m_id,fk_r_id,predict_value,createdAt) VALUES (' +
                    req.user +
                    ',' +
                    matchid +
                    ',' +
                    ruleid +
                    ',' +
                    lvi_tmp +
                    ',now());';
                }
            }
        }
        if (sqlQuery != null) {
            db.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    return res.send({ message: 'Data Not Saved.' });
                } else {
                    return res.send({ message: 'Data Saved.' });
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};