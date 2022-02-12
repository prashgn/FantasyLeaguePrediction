var express = require("express");

var app = express();
var bodyParser = require('body-parser')

/*
app.use('/assets',function(req,res,next){
    next();
});
*/
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use('/assets',express.static('assets'));

app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.render('index');
});

app.get('/contact',function(req,res){
    res.render('contact', {qs: req.query});
});

app.post('/contact', urlencodedParser, function (req, res) {
  res.render('contact-success',{data: req.body});
});

var MyObj = {
        name: 'Prashant',
        age: 10,
        hobbies: ['eating','fishing','playing']
};

app.get('/profile/:name',function(req,res){
    /*res.send('this is the profile page ' + req.params.name);*/
    res.render('profiles',{person: req.params.name, data: MyObj}); /* The default behavious is to look in the views folder */
});

app.listen(8080);

