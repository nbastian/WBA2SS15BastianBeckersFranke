var http = require('http');
var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();
var moment = require('moment');

var app = express();

// set bodyparser as default
app.use(bodyparser.urlencoded({ extended: true }));

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
            for(i=0; i<anVer.length; i++) {
                anVer[i].dateEnd = moment(anVer.dateEnd).format('YYYY-MM-DD HH:mm');
                anVer[i].dateStart = moment(anVer.dateStart).format('YYYY-MM-DD HH:mm');
            }
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
            for(i=0; i<veranstaltungen.length; i++) {
                veranstaltungen[i].dateEnd = moment(veranstaltungen.dateEnd).format('YYYY-MM-DD HH:mm');
                veranstaltungen[i].dateStart = moment(veranstaltungen.dateStart).format('YYYY-MM-DD HH:mm');
            }
            res.render('pages/veranstaltungen', {
                veranstaltungen: veranstaltungen                      
            });
        });
    });
                         
    x.end();
})

app.post('/login', function(req, res) {
    
    console.log(req.body);
    
    var options = {
		host: 'localhost',
		port: 1337,
		path: '/authenticate',
		method: 'POST',
		data: req.body,
		headers: {
		  	'Content-Type': 'application/json'
		}
    };

    // Request an Server
    var x = http.request(options, function(externalres){		
      	externalres.on('data', function(chunk){
            var token = JSON.parse(chunk);
            res.render('pages/indexein', {
                token: token         
            });
      	});			
    });
    
    x.end();
})



app.listen(1338, function(){
console.log("Server listen on Port 1338");
});