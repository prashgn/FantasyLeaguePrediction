const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const app = express();

const { authUser, authRole, tada } = require('./basicAuth');

const env = require('./config/env.js');

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const options = {
    host: env.HOST,
    user: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE,
};

var sessionStore = new MySQLStore(options);

app.use(
    session({
        secret: env.JWT_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: true,
        //cookie: { secure: true }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    if (req.isAuthenticated()) {
        /*console.log(
            'Final -  ' +
                'global.gb_user->' +
                global.gb_user +
                ' global.gb_roles->' +
                global.gb_roles +
                ' global.gb_details-> ' +
                global.gb_details +
                ' req.user->' +
                req.user
        );*/

        /*if (global.gb_roles === 'admin' && global.gb_user === req.user) {
            res.locals.isAdmin = true;
        } else {
            res.locals.isAdmin = false;
        }*/
        res.locals.username = req.session.username;
        res.locals.userid = req.session.userid;
        res.locals.isAdmin = req.session.isadmin;
        /* Pipe seperated heading and text */
        res.locals.statusmsg = "Tip|Did you check our new Dashboard?";
        /*Updates|Scores will be updated after match completion.*/
    }
    next();
});

//define routes
app.use('/', require('./routes/pages'));

app.listen(3001, () => {
    console.log('You are listening to port 3001');
});