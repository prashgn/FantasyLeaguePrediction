const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env.js');

const db = mysql.createConnection({
    host: env.HOST,
    user: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE,
});

exports.login = async (req, res) => {
    //console.log(req.body);
    //global.gb_user = '';
    //global.gb_roles + '';
    //global.gb_details = '';

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Email or Password could not be blank',
            });
        }
        var userQuery =
            'SELECT ' +
            'users.*, ' +
            'roles.role ' +
            'FROM users ' +
            'LEFT JOIN roles ON roles.fk_id = users.id ' +
            'WHERE email = "' +
            email +
            '";';
        db.query(userQuery, async (error, results) => {
            if (error) {
                console.log(error);
            }
            //console.log(results);

            if (results.length < 1) {
                return res.status(401).render('login', {
                    message: 'Enter valid email or password',
                });
            } else if (!(await bcrypt.compare(password, results[0].password))) {
                return res.status(401).render('login', {
                    message: 'Enter valid email or password',
                });
            } else {
                const id = results[0].id;
                //global.gb_user = id;
                //getProcessedData(id);
                //console.log('ID is: ' + id);
                const token = jwt.sign({ id: id }, env.JWT_SECRET, {
                    expiresIn: env.JWT_EXPIRES_IN,
                });

                //console.log('the token is: ' + token);
                const cookiesOptions = {
                    expires: new Date(Date.now() + env.JWT_COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };
                res.cookie('jwt', token, cookiesOptions);

                req.login(id, function (err) {
                    req.session.userid = results[0].id;
                    req.session.username = results[0].name;
                    req.session.isadmin = results[0].role;
                    res.status(200).redirect('/');
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

/*async function getProcessedData(id_val) {
    let role;
    global.gb_roles = '';
    global.gb_details = id_val.toString() + '-';
    try {
        db.query('select * from roles where fk_id = ?', [id_val], async (error, results) => {
            if (error) {
                console.log(error);
            }
            //console.log(results);

            if (results.length < 1) {
                console.log('Roles are not defined');
            } else {
                role = results[0].role;
                global.gb_roles = role;
                //console.log('Role is: ' + role);
                global.gb_details = id_val + ',' + global.gb_roles;
            }
        });
    } catch (e) {}
    return role;
}*/