/*
http.createServer(function(req,res){
    res.write("welcome moksh")
    res.end()
}).listen(8080)
*/
/*
var http = require('http')
var server = http.createServer(function(req,res){
    console.log('Request was made on url ' + req.url);
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.end('Hi Moki');
});
    
server.listen(8080);
console.log('Listening to port 8080');

*/
/*
var http = require('http')
var fs = require('fs');

var myReadstream =  fs.createReadStream(__dirname + '/readMe.txt', 'utf8');
var myWritestream = fs.createWriteStream(__dirname + '/writeMe.txt');

myReadstream.on('data', function(chunk) { 
    console.log('new chunk received'); 
    myWritestream.write(chunk);
});
*/
/*
var http = require('http')


var server = http.createServer(function(req,res){
    console.log('Request was made on url ' + req.url);
    res.writeHead(200,{'Content-Type': 'application/json'});
    var MyObj = {
        name: 'Prashant',
        age: 10
    };
    res.end(JSON.stringify(MyObj));
});
    
server.listen(8080);
console.log('Listening to port 8080');

*/
/*
var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req,res){
    console.log('Request was made on url ' + req.url);
    if(req.url === '/home' || req.url === '/'){
        res.writeHead(200, 'text/html');
        var myReadstream =  fs.createReadStream(__dirname + '/index.html', 'utf8').pipe(res);
    } else if(req.url === '/contact'){
        res.writeHead(200, 'text/html');
        var myReadstream =  fs.createReadStream(__dirname + '/contact.html', 'utf8').pipe(res);
    } else if(req.url === '/api'){
        res.writeHead(200,{'Content-Type': 'application/json'});
        var MyObj = {
            name: 'Prashant',
            age: 10
        };
       res.end(JSON.stringify(MyObj));
    } else{
        res.writeHead(404, 'text/html');
        var myReadstream =  fs.createReadStream(__dirname + '/404.html', 'utf8').pipe(res);
    }
    
});
    
server.listen(8080);
console.log('Listening to port 8080');

*/







