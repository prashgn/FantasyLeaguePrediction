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

exports.getUserProfile = async (req, res) => {
    message = '';
    try {
        var userQuery =
            'SELECT users.id, users.name, users.email FROM users WHERE users.id = ' +
            req.user +
            ';';

        db.query(userQuery, function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                res.render('profile', { userdata: results });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postUserProfileUpd = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        var userQuery =
            'SELECT users.id, users.name, users.email, users.password FROM users WHERE users.id = ' +
            req.user +
            ';';
        db.query(userQuery, async (error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length < 1) {
                return res.render('profile', {
                    userdata: results,
                    message: 'User not found.',
                });
            } else if (!(await bcrypt.compare(password, results[0].password))) {
                return res.status(401).render('profile', {
                    userdata: results,
                    message: 'You entered a wrong password.',
                });
            } else {
                var sqlQuery =
                    'UPDATE users SET ' +
                    'users.name = ? , ' +
                    'users.updatedAt = now() ' +
                    'WHERE users.id = ? ;';
                var data = [name.trim(), req.user];

                if (sqlQuery != null) {
                    db.query(sqlQuery, data, function (error1, results1, fields1) {
                        if (error) {
                            return res.render('profile', {
                                userdata: results,
                                message: 'Data Not Saved.',
                            });
                        } else {
                            db.query(userQuery, function (error2, results2, fields2) {
                                if (error) {
                                    return res.render('profile', {
                                        userdata: results2,
                                        message: 'Data Not Saved.',
                                    });
                                } else {
                                    req.session.username = results2[0].name;
                                    res.render('profile', {
                                        userdata: results2,
                                        message: 'Profile Updated.',
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postUserProfilePwdUpd = async (req, res) => {
    try {
        const { oldpassword, newpassword, confirmpassword } = req.body;

        var userQuery =
            'SELECT users.id, users.name, users.email, users.password FROM users WHERE users.id = ' +
            req.user +
            ';';
        db.query(userQuery, async (error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length < 1) {
                return res.render('profile', {
                    userdata: results,
                    message: 'User not found.',
                });
            } else if (!(await bcrypt.compare(oldpassword, results[0].password))) {
                return res.status(401).render('profile', {
                    userdata: results,
                    message: 'You entered a wrong password.',
                });
            } else {
                var sqlQuery =
                    'UPDATE users SET ' +
                    'users.password = ? , ' +
                    'users.updatedAt = now() ' +
                    'WHERE users.id = ? ;';
                let hashedPassword = await bcrypt.hash(newpassword, 8);
                var data = [hashedPassword, req.user];

                if (sqlQuery != null) {
                    db.query(sqlQuery, data, function (error1, results1, fields1) {
                        if (error) {
                            return res.render('profile', {
                                userdata: results,
                                message: 'Data Not Saved.',
                            });
                        } else {
                            db.query(userQuery, function (error2, results2, fields2) {
                                if (error) {
                                    return res.render('profile', {
                                        userdata: results2,
                                        message: 'Data Not Saved.',
                                    });
                                } else {
                                    res.render('profile', {
                                        userdata: results2,
                                        message: 'Password Updated.',
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
};