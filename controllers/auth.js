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

exports.register = (req, res) => {
    //console.log(req.body);

    /*
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm; */

    const { name, email, password, passwordConfirm } = req.body;
    db.query('select email from users where email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'The email is in use',
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Password dont match',
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);
        var d = new Date();
        const zeroPad = (num, places) => String(num).padStart(places, '0');
        var ConvDate =
            d.getFullYear() +
            '-' +
            zeroPad(d.getMonth() + 1, 2) +
            '-' +
            zeroPad(d.getDate(), 2) +
            ' ' +
            zeroPad(d.getHours(), 2) +
            ':' +
            zeroPad(d.getMinutes(), 2) +
            ':' +
            zeroPad(d.getSeconds(), 2);

        //console.log(ConvDate.toString());
        db.query(
            'insert into users set ?',
            {
                name: name.trim(),
                email: email.trim(),
                password: hashedPassword,
                createdAt: ConvDate,
                updatedAt: ConvDate,
            },
            () => {
                if (error) {
                    console.log(error);
                    return res.status(401).render('register', {
                        message: 'User not registered.',
                    });
                } else {
                    return res.render('login', {
                        message: 'User registered',
                    });
                }
            }
        );
    });
};