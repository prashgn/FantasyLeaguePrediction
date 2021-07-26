const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env.js');

var resultid ;
var part_query ;
var full_query ;
part_query = "";
full_query = "";

part_query = "update result set actual_value = ";

const db = mysql.createConnection({
    host: env.HOST,
    user: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE,
    multipleStatements: true,
});

exports.admindetail = async (req, res) => {
    var match_num = req.body.matchid;
    if ((match_num !== "")) {
        try {
            var execMatchSP = 'CALL InsertResult (' + match_num + ');';
            var execScoreSP = 'CALL InsertScore  (' + match_num + ');';
            var backup =
                'INSERT predict_backup SELECT * FROM predict where fk_m_id = ' + match_num + ';';
            var purge = 'delete FROM predict where fk_m_id = ' + match_num + ';';
            /*+ execScoreSP + backup + purge */
            db.query(execMatchSP , function (error, recordset) {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect('/admin');
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    else {
        res.render('admin', { data: 'Please selct a match from the List Box and Refresh the Page.'});
    }
    
};

exports.saveScoreData = async (req, res) => {
    var match_num = req.body.matchid;
    if ((match_num !== "")) {
        try {
            //var execMatchSP = 'CALL InsertResult (' + match_num + ');';
            var execScoreSP = 'CALL InsertScore  (' + match_num + ');';
            //var backup =
            //    'INSERT predict_backup SELECT * FROM predict where fk_m_id = ' + match_num + ';';
            //var purge = 'delete FROM predict where fk_m_id = ' + match_num + ';';
            /*  + backup + purge */
            db.query(execScoreSP , function (error, recordset) {
                if (error) {
                    console.log(error);
                } else {
                   res.redirect('/admin');
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    else {
        res.render('admin', { data: 'Please selct a match from the List Box and Refresh the Page.'});
    }
    
};

exports.calcScoreRank = async (req, res) => {
    var match_num = req.body.matchid;
    var nrr = req.body.nrr;
    if ((match_num !== "")) {
        try {
            var execCalcScore = 'CALL CalculateScore (' + match_num + ');';    
            var execCalcRank = 'CALL CalculateLeagueRank  (' + match_num + ');';
            var backup =
                'INSERT predict_backup SELECT * FROM predict where fk_m_id = ' + match_num + ';';
            var purge = 'delete FROM predict where fk_m_id = ' + match_num + ';';
            var matchStatComp = 'update match_det set match_det.completed = true  where match_det.id = ' + match_num + ';';
            //console.log(execCalcScore);
            //console.log(execCalcRank);
            //console.log(backup);
            //console.log(purge);
            //console.log(matchStatComp);
            
            db.query(execCalcScore + execCalcRank + backup + purge + matchStatComp , function (error, recordset) {
                if (error) {
                    console.log(error);
                } else {
                   res.redirect('/admin');
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    else {
        res.render('admin', { data: 'Please selct a match from the List Box and Refresh the Page.'});
    }
    
};

exports.calcScoreRankNRR = async (req, res) => {
    var match_num = req.body.matchid;
    var nrr = req.body.nrr;
    if ((match_num !== "")) {
        try {
            var execCalcScore = 'update score set score_value = 0 where fk_m_id = ' + match_num + ';';
            var execCalcRank = 'CALL CalculateLeagueRank  (' + match_num + ');';
            var backup =
                'INSERT predict_backup SELECT * FROM predict where fk_m_id = ' + match_num + ';';
            var purge = 'delete FROM predict where fk_m_id = ' + match_num + ';';
            var matchStatComp = 'update match_det set match_det.completed = true  where match_det.id = ' + match_num + ';';
console.log(execCalcScore);
            console.log(execCalcRank);
            console.log(backup);
            console.log(purge);
            console.log(matchStatComp);
            
            db.query(execCalcScore + execCalcRank + backup + purge + matchStatComp , function (error, recordset) {
                if (error) {
                    console.log(error);
                } else {
                   res.redirect('/admin');
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    else {
        res.render('admin', { data: 'Please selct a match from the List Box and Refresh the Page.'});
    }
    
};

exports.getAdmin = async (req, res) => {
    try {
        var fixtureQuery =
            'SELECT ' +
            "match_det.id AS 'matchid', " +
            "match_det.disp_match_num AS 'matchnum', " +
            "teamA.name AS 'teamA', " +
            "teamB.name AS 'teamB', " +
            "series.name AS 'seriesname', " +
            "series.year AS 'seriesyear', " +
            "series.month AS 'seriesmonth', " +
            "match_det.home_team AS 'hometeam', " +
            "match_det.venue AS 'venue', " +
            "DATE_FORMAT(match_det.start_time,'%d/%m/%y') as 'date', " +
            "TIME_FORMAT(match_det.start_time,'%r') as 'time' " +
            'FROM match_det ' +
            'INNER JOIN team teamA ON match_det.fk_team_A = teamA.id ' +
            'INNER JOIN team teamB ON match_det.fk_team_B = teamB.id ' +
            'INNER JOIN series     ON match_det.fk_s_id   = series.id ' +
            'where match_det.completed is null limit 1;';
        var resultQuery = 'select rule.name , rule.selection , result.*, CONVERT(result.timeAt, char) as "mytime" FROM rule INNER JOIN result on rule.id = result.fk_r_id INNER JOIN  match_det ON match_det.id = result.fk_m_id where match_det.completed is null ; ';
        var playerDetQuery =
            "select playerA.id as 'playerid', " +
            "playerA.name as 'playername', " +
            "teamA.id as 'teamid', " +
            "teamA.name as 'teamname' from match_det " +
            'INNER JOIN teammember teammemA ON teammemA.fk_teamid = match_det.fk_team_A ' +
            'INNER JOIN player playerA ON playerA.id = teammemA.fk_playerid ' +
            'INNER JOIN team teamA ON teamA.id = match_det.fk_team_A ' +
            'INNER JOIN  (select match_det.id from match_det where match_det.completed is null limit 1) as V2 on match_det.id = V2.id ' +
            'where teammemA.active = true ' +
            "union select playerA.id as 'playerid', " +
            "playerA.name as 'playername', " +
            "teamA.id as 'teamid', " +
            "teamA.name as 'teamname' from match_det " +
            'INNER JOIN teammember teammemA ON teammemA.fk_teamid = match_det.fk_team_B ' +
            'INNER JOIN player playerA ON playerA.id = teammemA.fk_playerid ' +
            'INNER JOIN team teamA ON teamA.id = match_det.fk_team_B ' +
            'INNER JOIN  (select match_det.id from match_det where match_det.completed is null limit 1) as V2 on match_det.id = V2.id ' +
            'where teammemA.active = true; ';
			
        var matchDetQuery = 
            "select match_det.id, teamA.id as 'teamid', teamA.name as 'teamname' "  +
            "from match_det " + 
            "INNER JOIN team teamA ON teamA.id = match_det.fk_team_A " + 
            "INNER JOIN  (select match_det.id from match_det where match_det.completed is null limit 1) as V2 on match_det.id = V2.id " +
            "union " +
            "select match_det.id, teamA.id as 'teamid', teamA.name as 'teamname' " + 
            "from match_det " + 
            "INNER JOIN team teamA ON teamA.id = match_det.fk_team_B " +
            "INNER JOIN  (select match_det.id from match_det where match_det.completed is null limit 1) as V2 on match_det.id = V2.id; ";
       // console.log("-------------> " + playerDetQuery);
      //  console.log("-------------> " + matchDetQuery);
        
        db.query(fixtureQuery + resultQuery + playerDetQuery + matchDetQuery , function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            if (results.length < 1) {
                return res.status(401).render('/', {
                    message: 'No data found.',
                });
            } else {
                 //console.log("-------------> " + results);
                res.render('admin', { data: results });
            }
        });
    } catch (error) {
        console.log(error);
    }
};


exports.saveMatchData = async (req, res) => {
    var match_num = req.body.matchid;
    var text = JSON.stringify(req.body);

    // Converting JSON object to JS object
    var obj = JSON.parse(text);
    printValues(obj);
    
    //console.log(JSON.stringify(req.body));
   // console.log(full_query);
    if ((match_num !== "") ) {
        
        try {             
            db.query(full_query, function (error, results) {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect('/admin');
                }
            }); 
        } catch (error) {
            console.log(error);
        } 
    }
    else {
        res.render('admin', { data: 'Please selct a match from the List Box and Refresh the Page.'});
    }
    
};

// Define recursive function to print nested values
function printValues(obj) {

    for(var k in obj) {
        if(obj[k] instanceof Object) {
            printValues(obj[k]);
        } else {
            if (k.match("resultid")){
               resultid = obj[k];
            }
            if (k.match("ruleidval")){
                if ((obj[k] == '') || (obj[k] == 'Choose value...')){
                   part_query = part_query + 'NULL';
                }
                else{
                   part_query = part_query + obj[k];
                }
                
            }
            if (k.match("ruleiddt")){
                part_query = part_query + " , timeAt = '" + obj[k] + "'  where id = " + resultid + ";" ;
                full_query = full_query + part_query;
                part_query = "update result set actual_value = ";
            }
            
        };
    }
};