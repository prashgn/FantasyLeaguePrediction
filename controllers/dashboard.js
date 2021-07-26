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

exports.getMatch = async (req, res) => {
	try {
        var fixtureQuery =
            'SELECT ' +
            'match_det.id AS "matchid", ' +
            'match_det.disp_match_num AS "matchnum", ' +
            'teamA.name AS "teamA", ' +
            'teamB.name AS "teamB", ' +
            'series.name AS "seriesname", ' +
            'series.year AS "seriesyear", ' +
            'series.month AS "seriesmonth", ' +
            'match_det.home_team AS "hometeam", ' +
            'match_det.venue AS "venue", ' +
            'DATE_FORMAT(match_det.start_time,"%d/%m/%y") as "date", ' +
            'TIME_FORMAT(match_det.start_time,"%r") as "time" ' +
            'FROM match_det ' +
            'INNER JOIN team teamA ON match_det.fk_team_A = teamA.id ' +
            'INNER JOIN team teamB ON match_det.fk_team_B = teamB.id ' +
            'INNER JOIN series     ON match_det.fk_s_id   = series.id ' +
            'WHERE match_det.completed IS NULL;';

        db.query(fixtureQuery, function (error, results, fields) {
            if (error) {
                console.log(error);
            }
           else {
                res.render('dashboard', { data: results });
            }
        });
	} catch (error) {
        console.log(error);
	}
};

exports.getCharts = async (req, res) => {
	try {
        var matchid = req.query.matchid;
        var teamDashboardQuery =
            'SELECT ' +
            'teamA.name AS "TeamA", ' +
            'teamB.name AS "TeamB", ' +
            '(SELECT COUNT(id) FROM match_det ' +
            ' WHERE (match_det.fk_team_A = parent.fk_team_A OR ' +
            '        match_det.fk_team_B = parent.fk_team_A) AND ' +
            '        match_det.completed = true) AS "MatchPlayedByTeamA", ' +
            '(SELECT COUNT(id) FROM match_det ' +
            ' WHERE (match_det.fk_team_A = parent.fk_team_B OR ' +
            '        match_det.fk_team_B = parent.fk_team_B) AND ' +
            '        match_det.completed = true) AS "MatchPlayedByTeamB", ' +
            '(SELECT COUNT(id) FROM result ' +
            ' WHERE result.actual_value = parent.fk_team_A AND ' +
            '       result.fk_r_id = 1) AS "TossWonByTeamA", ' +
            '(SELECT COUNT(id) FROM result ' +
            ' WHERE result.actual_value = parent.fk_team_B AND ' +
            '       result.fk_r_id = 1) AS "TossWonByTeamB", ' +
            '(SELECT COUNT(id) FROM result ' +
            ' WHERE result.actual_value = parent.fk_team_A AND ' +
            '       result.fk_r_id = 2) AS "MatchWonByTeamA", ' +
            '(SELECT COUNT(id) FROM result ' +
            ' WHERE result.actual_value = parent.fk_team_B AND ' +
            '       result.fk_r_id = 2) AS "MatchWonByTeamB" ' +
            'FROM match_det AS parent ' +
            'INNER JOIN team teamA ON parent.fk_team_A = teamA.id ' +
            'INNER JOIN team teamB ON parent.fk_team_B = teamB.id ' +
            'WHERE parent.id = ' +
            matchid + ';';
        
        var momDashboardQuery =
            'SELECT * FROM ' +
            '(SELECT ' +
            ' team.name AS "TeamName", ' +
            ' player.name AS "PlayerName", ' +
            ' (SELECT COUNT(*) FROM result ' +
            '  WHERE result.actual_value = teammember.fk_playerid AND ' +
            '        result.fk_r_id = 3) AS "MOMCount" ' +
            ' FROM match_det AS parent ' +
            ' INNER JOIN teammember ' +
            ' ON (teammember.fk_teamid = parent.fk_team_A OR ' +
            '     teammember.fk_teamid = parent.fk_team_B) ' +
            ' INNER JOIN player ' +
            ' ON player.id = teammember.fk_playerid ' +
            ' INNER JOIN team ' +
            ' ON team.id = teammember.fk_teamid ' +
            'WHERE parent.id = ' +
            matchid +
            ') final ' +
            'WHERE MOMCount <> 0 ' +
            'ORDER BY MOMCount DESC, PlayerName ASC;';

        var scoreDashboardQuery = 
            'SELECT ' +
            'team.name AS "Team", ' +
            'teamA.name AS "TeamA", ' +
            'teamB.name AS "TeamB", ' +
            'result.fk_r_id AS "Rule", ' +
            'result.actual_value AS "Value" ' +
            'FROM result ' +
            'INNER JOIN match_det current_match ' +
            'ON current_match.id = ' + matchid + ' ' +
            'INNER JOIN match_det prev_match ' +
            'ON prev_match.id = result.fk_m_id AND ' +
            '   prev_match.completed = true AND ' +
            '  (prev_match.fk_team_A = current_match.fk_team_A OR ' +
            '   prev_match.fk_team_B = current_match.fk_team_A) ' +
            'INNER JOIN team ' +
            'ON team.id = current_match.fk_team_A ' +
            'INNER JOIN team teamA ' +
            'ON teamA.id = prev_match.fk_team_A ' +
            'INNER JOIN team teamB ' +
            'ON teamB.id = prev_match.fk_team_B ' +
            'WHERE result.fk_r_id = 4 OR result.fk_r_id = 5 ' +
            'ORDER BY result.fk_r_id, result.fk_m_id; ' +
            '' +
            'SELECT ' +
            'team.name AS "Team", ' +
            'teamA.name AS "TeamA", ' +
            'teamB.name AS "TeamB", ' +
            'result.fk_r_id AS "Rule", ' +
            'result.actual_value AS "Value" ' +
            'FROM result ' +
            'INNER JOIN match_det current_match ' +
            'ON current_match.id = ' + matchid + ' ' +
            'INNER JOIN match_det prev_match ' +
            'ON prev_match.id = result.fk_m_id AND ' +
            '   prev_match.completed = true AND ' +
            '  (prev_match.fk_team_A = current_match.fk_team_B OR ' +
            '   prev_match.fk_team_B = current_match.fk_team_B) ' +
            'INNER JOIN team ' +
            'ON team.id = current_match.fk_team_B ' +
            'INNER JOIN team teamA ' +
            'ON teamA.id = prev_match.fk_team_A ' +
            'INNER JOIN team teamB ' +
            'ON teamB.id = prev_match.fk_team_B ' +
            'WHERE result.fk_r_id = 4 OR result.fk_r_id = 5 ' +
            'ORDER BY result.fk_r_id, result.fk_m_id;';

        db.query(teamDashboardQuery + momDashboardQuery + scoreDashboardQuery, function (error, results, fields) {
            if (error) {
                console.log(error);
            }
           else {
                res.send(results);
            }
        });
	} catch (error) {
        console.log(error);
	}
};