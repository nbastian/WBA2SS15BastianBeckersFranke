var express = require('express');
var app = express();


var bodyParser = require('body-parser');
//Parser-Objekt anlegen
var jsonParser = bodyParser.json();

var userliste = [{name: 'Hier kommt der Name', nummer: 'Hier kommt die Nummer'}];

//Routing einer GET Methode auf die Ressource foo/beliebige ID
app.get('/user/:id', function(req, res) {
    res.status('200');
    res.send('Hallo ' + req.params.id + ', schön dass Sie uns beehren. :-)');
});

//Routing einer POST Methode auf die Ressource foo
app.post('/verwaltung', jsonParser, function(req, res) {
    userliste.push(req.body);
    res.status('200').send('User wurde der Liste hinzugefügt');
});

app.get('/verwaltung', jsonParser, function(req, res) {
    res.status('200').send(userliste);
});


app.listen(1337);

// test kommentar