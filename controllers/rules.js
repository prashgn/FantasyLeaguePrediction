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

exports.getRules = async (req, res) => {
    try {
        var ruleQuery =
           'select rule.id as "RuleID", ' + 
 	       'rule.name, ' +
	       'rule.description, ' +
	       'rule.points, ' +
	       'rule.stage, ' +
	       'rule.selection ' +
           'from rule ' +
           'where rule.active = 1 ' +
           'order by rule.id;'; 
        
        var rangeQuery = 
	       'select id as "rangeID", ' + 
           'fk_r_id as "RuleFKID", ' + 
	       'point_range as "pointRange", ' + 
	       'points as "RangePoints" ' + 
	       'from rule_range;'; 
        db.query(ruleQuery + rangeQuery, function (error, results, fields) {
            if (error) {
                console.log(error);
            }
           else {
                res.render('rules', { data: results });
            }
        });
    } catch (error) {
        console.log(error);
    }
};