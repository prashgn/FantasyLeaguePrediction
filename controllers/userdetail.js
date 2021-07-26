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

exports.getUserDetail = async (req, res) => {
    try {
        var userDetailQuery =
            'SELECT ' +
            'users.name AS username ' +
            'FROM users ' +
            'WHERE users.id = ' +
            req.params.userid +
            ';';
        var userMatchDetailQuery =
            'SELECT DISTINCT ' +
            'match_det.id AS "matchid", ' +
            'match_det.disp_match_num AS "matchnum", ' +
            'teamA.name AS "teamA", ' +
            'teamB.name AS "teamB", ' +
            'series.name AS "seriesname", ' +
            'series.year AS "seriesyear", ' +
            'series.month AS "seriesmonth", ' +
            'match_det.home_team AS "hometeam", ' +
            'match_det.venue AS "venue", ' +
            'DATE_FORMAT(DATE_ADD(match_det.start_time, INTERVAL 330 MINUTE ),"%d/%m/%y") as "date", ' +
            'TIME_FORMAT(DATE_ADD(match_det.start_time, INTERVAL 330 MINUTE ),"%r") as "time", ' +
            '( ' +
            'SELECT ' +
            'SUM(score.score_value) ' +
            'FROM score ' +
            'WHERE score.fk_u_id = ' +
            req.params.userid +
            ' ' +
            'AND score.fk_m_id = match_det.id ' +
            'GROUP BY score.fk_u_id, score.fk_m_id ' +
            ') AS "totalscore" ' +
            'FROM match_det ' +
            'LEFT JOIN score ON score.fk_u_id = ' +
            req.params.userid +
            ' ' +
            'AND score.fk_m_id = match_det.id ' +
            'INNER JOIN team teamA ON teamA.id = match_det.fk_team_A ' +
            'INNER JOIN team teamB ON teamB.id = match_det.fk_team_B ' +
            'INNER JOIN series     ON series.id = match_det.fk_s_id ' +
            'WHERE match_det.completed = 1 ' +
            'ORDER BY match_det.id DESC;';
        var userScoreDetailQuery =
            'SELECT ' +
            'match_det.id AS "matchid", ' +
            'rule.name AS "rulename", ' +
            'score.score_value AS "score", ' +
            'CASE ' +
            'WHEN rule.selection = "player" THEN ' +
            '(SELECT player.name FROM player WHERE player.id = score.predict_value) ' +
            'WHEN rule.selection = "team" THEN ' +
            '(SELECT team.name FROM team WHERE team.id = score.predict_value) ' +
            'WHEN rule.selection IS NULL THEN ' +
            '(score.predict_value) ' +
            'END AS "predictvalue", ' +
            'CASE ' +
            'WHEN rule.selection = "player" THEN ' +
            '(SELECT player.name FROM player WHERE player.id = result.actual_value) ' +
            'WHEN rule.selection = "team" THEN ' +
            '(SELECT team.name FROM team WHERE team.id = result.actual_value) ' +
            'WHEN rule.selection IS NULL THEN ' +
            '(result.actual_value) ' +
            'END AS "resultvalue" ' +
            'FROM match_det ' +
            'INNER JOIN score ON score.fk_u_id = ' +
            req.params.userid +
            ' ' +
            'AND score.fk_m_id = match_det.id ' +
            'INNER JOIN rule ON rule.id = score.fk_r_id ' +
            'INNER JOIN result ON result.fk_m_id = match_det.id ' +
            'AND result.fk_r_id = score.fk_r_id ' +
            'WHERE match_det.completed = 1 ' +
            'ORDER BY match_det.id DESC, rule.id;';

        db.query(userDetailQuery + userMatchDetailQuery + userScoreDetailQuery, function (
            error,
            results,
            fields
        ) {
            if (error) {
                console.log(error);
            } else {
                res.render('userdetail', { data: results });
            }
        });
    } catch (error) {
        console.log(error);
    }
};