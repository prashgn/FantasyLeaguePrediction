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

exports.indexdetail = async (req, res) => {
    let league_data;
    try {
        var matchDetQuery =
            'SELECT match_det.id AS "matchid", ' +
            'match_det.disp_match_num AS "matchnum", ' +
            'match_det.completed AS "completed", ' +
            'match_det.matchresult AS "matchresult", ' +
            'teamA.name AS "teamA", ' +
            'teamB.name AS "teamB", ' +
            'DATE_FORMAT(DATE_ADD(match_det.start_time, INTERVAL 330 MINUTE ),"%d/%m/%y") AS "date", ' +
            'TIME_FORMAT(DATE_ADD(match_det.start_time, INTERVAL 330 MINUTE ),"%r") AS "time" ' +
            'FROM match_det ' +
            'INNER JOIN team teamA ON match_det.fk_team_A = teamA.id ' +
            'INNER JOIN team teamB ON match_det.fk_team_B = teamB.id ' +
            'WHERE match_det.completed IS NULL limit 5;';
        var ruleQuery = 'SELECT * FROM rule;';
        var leagueQuery =
            'SELECT ' +
            'league.id AS "leagueid", ' +
            'league.name AS "leaguename", ' +
            'userleague.ranked AS "rank", ' +
            '(SELECT COUNT(id) ' +
            'FROM userleague ' +
            'WHERE userleague.fk_l_id = league.id) AS "totalmember" ' +
            'FROM userleague ' +
            'INNER JOIN league ON league.id = userleague.fk_l_id ' +
            'WHERE userleague.fk_u_id = ' +
            req.user +
            ';';

        db.query(matchDetQuery + ruleQuery + leagueQuery, function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                res.render('index', { data: results });
            }
        });
    } catch (error) {
        console.log(error);
    }
};