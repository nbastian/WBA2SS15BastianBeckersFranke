/**
 * Module dependencies.
 */

// include express module
var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis').createClient();

// init em up
var app = express();
var jsonParser = bodyParser.json();

// redis onError
redis.on('error', function (err) {
	console.log(err);
});



// static userList
var userliste = [
	{
		name: 'Hier kommt der Name', 
		nummer: 'Hier kommt die Nummer'
	}
];

// Routing einer GET Methode auf die Ressource foo/beliebige ID
app.get('/user/:id', function(req, res) {
    res.status(200);
    res.send('Hallo ' + req.params.id + ', schön dass Sie uns beehren. :-)');
});

// Routing einer POST Methode auf die Ressource foo
app.post('/verwaltung', jsonParser, function(req, res) {
    userliste.push(req.body);
    res.status(200).send('User wurde der Liste hinzugefügt');
});

app.get('/verwaltung', jsonParser, function(req, res) {
    res.status(200).send(userliste);
});


// Start server listening..
var server = app.listen(1337, function () {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('App listening at http://%s:%s', host, port);
});