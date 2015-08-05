var http = require('http');
var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();

var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/event',
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    
    var x = http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            var test = JSON.parse(chunk);
            console.log(test);
            //var html = ejs.render('pages/index', test);
            res.render('pages/index', {
                test: test                      
            });
            //res.send(html);
        });
    });
                         
    x.end();
    
    
    
})

app.listen(1338, function(){
console.log("Server listen on Port 1338");
});