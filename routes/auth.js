const express = require("express");
const router = express.Router();

const authController = require('../controllers/auth'); 
const authLogin = require('../controllers/login'); 


router.post('/register', authController.register) ;

router.post('/login', authLogin.login) ;

module.exports = router;