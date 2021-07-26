const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const authLogin = require('../controllers/login');
const index = require('../controllers/index');
const callPredict = require('../controllers/predict');
const callResult = require('../controllers/result');
const callUserDetail = require('../controllers/userdetail');
const callFixture = require('../controllers/fixture');
const callLeague = require('../controllers/league');
const callRules = require('../controllers/rules');
//const authFetch = require('../controllers/fetch');

const callDashboard = require('../controllers/dashboard');

const { authUser, authRole } = require('../controllers/basicAuth');
const admin = require('../controllers/admin');
const callProfile = require('../controllers/profile');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require('passport');

/*
, passport.authenticate('local',{
     successRedirect: '/index',
     failureRedirect: '/register'
   }) 
*/

/*
router.get('/', authenticationMiddleware(), (req, res) => {
    //console.log('pages.js - index -' + req.user + req.isAuthenticated());
    res.render('index');
    console.log('index');
});
*/
/*-----GET-----*/
router.get('/', authenticationMiddleware(), index.indexdetail);


router.get('/register', (req, res) => {
    res.render('register', {
        message: '',
    });
    //console.log('register');
});

router.get('/login', (req, res) => {
    res.render('login', {
        message: '',
    });
    //console.log('login');
});

//router.get('/profiles', authenticationMiddleware(), users.findAll);

router.get('/logout', authenticationMiddleware(), function (req, res, next) {
    req.logout();
    req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
    });
});

router.get('/predict', authenticationMiddleware() , callPredict.predict);

router.get('/result', authenticationMiddleware() , callResult.getResult);

router.get('/leagues', authenticationMiddleware(), callLeague.getLeague);

router.get('/createleague', authenticationMiddleware(), callLeague.getCreateLeague);

router.get('/fixtures', authenticationMiddleware(), callFixture.getFixture);
/*
router.get('/dashboard', authenticationMiddleware(), function (req, res) {
    console.log("D-" + req.user);
    res.render('dashboard');
});
*/

router.get('/dashboard', authenticationMiddleware(), callDashboard.getMatch);

router.get('/dashboardcharts', authenticationMiddleware(), callDashboard.getCharts);

router.get('/howto', function (req, res) {
    res.render('howto');
});

router.get('/rules', authenticationMiddleware(), callRules.getRules);

router.get('/profile', authenticationMiddleware(), callProfile.getUserProfile);

router.get('/leaguedetail/:leagueid', authenticationMiddleware() , callLeague.getLeagueDetail);

router.get('/userdetail/:userid', authenticationMiddleware() , callUserDetail.getUserDetail);

router.get('/admin', authUser, authRole('admin'), admin.getAdmin);


/*-----POST-----*/

router.post('/admin', authenticationMiddleware(), urlencodedParser, admin.admindetail);

router.post('/admin/saveScoreData', authenticationMiddleware(), urlencodedParser, admin.saveScoreData);

router.post('/admin/calcScoreRank', authenticationMiddleware(), urlencodedParser, admin.calcScoreRank);

router.post('/admin/saveMatchData', authenticationMiddleware(), urlencodedParser, admin.saveMatchData);


router.post('/admin/calcScoreRankNRR', authenticationMiddleware(), urlencodedParser, admin.calcScoreRankNRR);

router.post('/register', urlencodedParser, authController.register);

router.post('/login', urlencodedParser, authLogin.login);

router.post('/predict', authenticationMiddleware() , callPredict.postpredict);

router.post('/profile/profileupd', authenticationMiddleware() , urlencodedParser, callProfile.postUserProfileUpd);

router.post('/profile/passwordupd', authenticationMiddleware() , urlencodedParser, callProfile.postUserProfilePwdUpd);

router.post('/createleague', authenticationMiddleware() , callLeague.postCreateLeague);

router.post('/joinleague', authenticationMiddleware() , callLeague.postJoinLeague);

passport.serializeUser(function (id, done) {
    done(null, id);
});

passport.deserializeUser(function (id, done) {
   /* if (global.gb_user !== id) {
        global.gb_user = id;
        authFetch.getRole(id);
    } */
    /*console;.log(
        'deserializeUser -> ' + global.gb_user + '  ' + global.gb_roles + '   ' + global.gb_details
    );*/
    done(null, id);
});

function authenticationMiddleware() {
    return (req, res, next) => {
        //console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    };
}

module.exports = router;