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

exports.getFixture = async (req, res) => {
    try {
        var fixtureQuery =
            'SELECT ' +
            'match_det.id AS "matchid", ' +
            'match_det.disp_match_num AS "matchnum", ' +
            'match_det.completed AS "completed", ' +
            'teamA.name AS "teamA", ' +
            'teamB.name AS "teamB", ' +
            'series.name AS "seriesname", ' +
            'series.year AS "seriesyear", ' +
            'series.month AS "seriesmonth", ' +
            'match_det.home_team AS "hometeam", ' +
            'match_det.venue AS "venue", ' +
            'DATE_FORMAT(DATE_ADD(match_det.start_time, INTERVAL 330 MINUTE ),"%d/%m/%y") as "date", ' +
            'TIME_FORMAT(DATE_ADD(match_det.start_time, INTERVAL 330 MINUTE ),"%r") as "time", ' +
            'match_det.matchresult AS "result", ' +
            'match_det.mom AS "mom" ' +
            'FROM match_det ' +
            'INNER JOIN team teamA ON match_det.fk_team_A = teamA.id ' +
            'INNER JOIN team teamB ON match_det.fk_team_B = teamB.id ' +
            'INNER JOIN series     ON match_det.fk_s_id   = series.id ' +
            'order by match_det.id; ';
        db.query(fixtureQuery, function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                res.render('fixtures', { data: results });
            }
        });
    } catch (error) {
        console.log(error);
    }
};