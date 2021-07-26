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

exports.getLeague = async (req, res) => {
    try {
        var leagueQuery =
            'SELECT ' +
            'league.id AS "leagueid", ' +
            'league.name AS "leaguename", ' +
            'userleague.owner AS "admin", ' +
            'userleague.ranked AS "rank", ' +
            'series.name AS "seriesname", ' +
            'series.year AS "seriesyear", ' +
            'series.month AS "seriesmonth", ' +
            '(SELECT COUNT(id) ' +
            'FROM userleague ' +
            'WHERE userleague.fk_l_id = league.id) AS "totalmember" ' +
            'FROM userleague ' +
            'INNER JOIN league ON league.id = userleague.fk_l_id ' +
            'INNER JOIN series ON league.fk_s_id = series.id ' +
            'WHERE userleague.fk_u_id = ' +
            req.user +
            ';';

        db.query(leagueQuery, function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                res.render('leagues', { data: results });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getCreateLeague = async (req, res) => {
    try {
        var seriesQuery =
            'SELECT ' +
            'series.id AS "seriesid", ' +
            'series.name AS "seriesname", ' +
            'series.year AS "seriesyear", ' +
            'series.month AS "seriesmonth" ' +
            'FROM series;';

        db.query(seriesQuery, function (error, results, fields) {
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

exports.postCreateLeague = async (req, res) => {
    try {
        var result = req.body;

        var sqlCheckLeaguQuery =
            'SELECT * FROM league WHERE league.name = "' + result.createLeagueName.trim() + '";';
        if (sqlCheckLeaguQuery != null) {
            db.query(sqlCheckLeaguQuery, function (error, results, fields) {
                if (error) {
                    return res.send({ message: error });
                } else {
                    if (results.length >= 1) {
                        return res.send({ message: 'League Name already exist.' });
                    } else {
                        var sqlQuery =
                            'INSERT INTO league (name,fk_id,fk_s_id) VALUES ("' +
                            result.createLeagueName.trim() +
                            '",' +
                            req.user +
                            ',' +
                            result.seriesName +
                            ');';
                        if (sqlQuery != null) {
                            db.query(sqlQuery, function (error1, results1, fields1) {
                                if (error1) {
                                    return res.send({ message: error1 });
                                } else {
                                    var sqlQuery1 =
                                        'INSERT INTO userleague (fk_u_id,fk_l_id,owner) VALUES (' +
                                        req.user +
                                        ',' +
                                        results1.insertId +
                                        ',' +
                                        1 +
                                        ');';
                                    if (sqlQuery1 != null) {
                                        db.query(sqlQuery1, function (error2, results2, fields2) {
                                            if (error2) {
                                                return res.send({ message: 'Data Not Saved.' });
                                            } else {
                                                return res.send({ message: '' });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.postJoinLeague = async (req, res) => {
    try {
        var result = req.body;
        var sqlLeagueQuery =
            'SELECT * FROM league WHERE league.name = "' + result.joinLeagueName.trim() + '";';
        var sqlUserLeagueQuery =
            'SELECT ' +
            'league.id, ' +
            'league.name, ' +
            'userleague.fk_u_id, ' +
            'userleague.fk_l_id ' +
            'FROM league ' +
            'INNER JOIN userleague ON userleague.fk_l_id = league.id AND userleague.fk_u_id = ' +
            req.user +
            ' ' +
            'WHERE league.name = "' +
            result.joinLeagueName.trim() +
            '";';
        if (sqlLeagueQuery != null) {
            db.query(sqlLeagueQuery + sqlUserLeagueQuery, function (error, results, fields) {
                if (error) {
                    return res.send({ message: 'Data Not Saved.' });
                } else {
                    if (results[0].length < 1) {
                        return res.send({ message: 'No League found.' });
                    } else if (results[0].length >= 1 && results[1].length >= 1) {
                        return res.send({ message: 'You are already part of this league.' });
                    } else {
                        /* League exist but no UserLeague then create it */
                        if (results[0].length >= 1 && results[1].length < 1) {
                            var sqlQuery1 =
                                'INSERT INTO userleague (fk_u_id,fk_l_id) VALUES (' +
                                req.user +
                                ',' +
                                results[0][0].id +
                                ');';
                            if (sqlQuery1 != null) {
                                db.query(sqlQuery1, function (error1, results1, fields1) {
                                    if (error1) {
                                        return res.send({ message: 'Data Not Saved.' });
                                    } else {
                                        return res.send({ message: '' });
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getLeagueDetail = async (req, res) => {
    try {
        var leagueDetailQuery =
            'SELECT ' +
            'league.id AS "leagueid", ' +
            'league.name AS "leaguename", ' +
            'users.name AS "username", ' +
            'userleaguedet.fk_u_id AS "userid", ' +
            'userleaguedet.ranked AS "rank", ' +
            'userleaguedet.score AS "score", ' +
            'ISNULL(userleaguedet.ranked) "nullsort" ' +
            'FROM userleague ' +
            'INNER JOIN league ON league.id = userleague.fk_l_id ' +
            'INNER JOIN userleague userleaguedet ON userleaguedet.fk_l_id = userleague.fk_l_id ' +
            'INNER JOIN users  ON users.id  = userleaguedet.fk_u_id ' +
            'WHERE userleague.fk_u_id =  ' +
            req.user +
            ' ' +
            'AND userleague.fk_l_id = ' +
            req.params.leagueid +
            ' ' +
            'ORDER BY nullsort, rank, score, username;';

        db.query(leagueDetailQuery, function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                res.render('leaguedetail', { data: results });
            }
        });
    } catch (error) {
        console.log(error);
    }
};