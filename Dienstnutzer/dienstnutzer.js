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
            var anVer = JSON.parse(chunk);
            res.render('pages/index', {
                anVer: anVer                      
            });
        });
    });
                         
    x.end();
})

app.get('/firmen', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/companys',
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    
    var x = http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            var unternehmen = JSON.parse(chunk);
            res.render('pages/firmen', {
                unternehmen: unternehmen                      
            });
        });
    });
                         
    x.end();
})

app.get('/veranstaltungen', function(req, res) {
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
            var veranstaltungen = JSON.parse(chunk);
            res.render('pages/veranstaltungen', {
                veranstaltungen: veranstaltungen                      
            });
        });
    });
                         
    x.end();
})



app.listen(1338, function(){
console.log("Server listen on Port 1338");
});