var express = require("express");

var todoController = require('./controllers/todoController');

var app = express();


app.set('view engine', 'ejs');

app.use(express.static('./public'));

//fire controllers
todoController(app);

app.listen(8080);
console.log('You are listening to port 8080');



/*
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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

app.get('/profile/:name',function(req,res){ */
    /*res.send('this is the profile page ' + req.params.name);*/ 
   /* res.render('profiles',{person: req.params.name, data: MyObj}); 
}); */

