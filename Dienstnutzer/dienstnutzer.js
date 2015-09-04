var http = require('http');
var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();
var moment = require('moment');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

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
            var jetzt = moment();
            for(i=0; i<anVer.length; i++) {
                var start = moment(anVer[i].dateStart, "X").format('YYYY-MM-DD HH:mm');
                if(jetzt.isBefore(start)){
                    anVer[i].dateEnd = moment(anVer[i].dateEnd, "X").format('YYYY-MM-DD HH:mm');
                    anVer[i].dateStart = moment(anVer[i].dateStart, "X").format('YYYY-MM-DD HH:mm');
                }else{
                    delete anVer[i];
                }
            }
            res.render('pages/index', {
                anVer: anVer,
                name: localStorage.getItem("name")
            });
        });
    });
                         
    x.end();
})

app.get('/firmen', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/companys?token='+localStorage.getItem("token"),
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    
    var x = http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            var unternehmen = JSON.parse(chunk);
            if (unternehmen.success == false){
                res.render('pages/zutrittverboten');
            }else{
                res.render('pages/firmen', {
                    unternehmen: unternehmen,
                    name: localStorage.getItem("name")
                });
            }
        });
    });
    x.end();
})

app.post('/veranstaltungen', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/event',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var x = http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            var veranstaltung = JSON.parse(chunk);
            if(veranstaltung != null)
            {
                res.json({"id": veranstaltung.id,
                          "start": veranstaltung.dateStart,
                          "end": veranstaltung.dateEnd,
                          "name": veranstaltung.name,
                         "success": true});
            }
        });
    });
    
    x.write(JSON.stringify(req.body));
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
                veranstaltungen[i].dateEnd = moment(veranstaltungen[i].dateEnd, 'X').format('YYYY-MM-DD HH:mm');
                veranstaltungen[i].dateStart = moment(veranstaltungen[i].dateStart, 'X').format('YYYY-MM-DD HH:mm');
            }
            res.render('pages/veranstaltungen', {
                veranstaltungen: veranstaltungen,
                name: localStorage.getItem("name")
            });
        });
    });                   
    x.end();
})

app.get('/veranstaltungen/:VeranstaltungsID', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/event/'+req.params.VeranstaltungsID,
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    
    var x = http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            var veranstaltung = JSON.parse(chunk);
            
            veranstaltung.dateEnd = moment(veranstaltung.dateEnd, 'X').format('YYYY-MM-DD HH:mm');
            veranstaltung.dateStart = moment(veranstaltung.dateStart, 'X').format('YYYY-MM-DD HH:mm');

            res.render('pages/veranstaltung', {
                veranstaltung: veranstaltung,
                name: localStorage.getItem("name")
            });
        });
    });                     
    x.end();
})

app.post('/signup', function(req, res) {
    
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/user',
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    var x= http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            var user = JSON.parse(chunk);
            /*if(user != null){
                res.json({"success": true});
            }*/
        });
    });
        
        x.write(JSON.stringify(req.body));
        x.end();
    
        var options = {
		host: 'localhost',
		port: 1337,
		path: '/authenticate',
		method: 'POST',
		headers: {
		  	'Content-Type': 'application/json'
		}
    };
    
    var x = http.request(options, function(externalres){		
      	externalres.on('data', function(chunk){
            var token = JSON.parse(chunk);
            // Save data to the current local store falls falsches Login alten Token auch löschen eher für Testzwecke
            if (token.success == true){
                localStorage.setItem("token", token.token);
                localStorage.setItem("name", req.body.username);
            }
      	});			
    });
    
    x.write(JSON.stringify(req.body));
    x.end();
    
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
            var jetzt = moment();
            for(i=0; i<anVer.length; i++) {
                var start = moment(anVer[i].dateStart, "X").format('YYYY-MM-DD HH:mm');
                if(jetzt.isBefore(start)){
                    anVer[i].dateEnd = moment(anVer[i].dateEnd, "X").format('YYYY-MM-DD HH:mm');
                    anVer[i].dateStart = moment(anVer[i].dateStart, "X").format('YYYY-MM-DD HH:mm');
                }else{
                    delete anVer[i];
                }
            }
            res.render('pages/index', {
                anVer: anVer,
                name: localStorage.getItem("name")
            });
        });
    });
                         
    x.end();
})

app.post('/login', function(req, res) {
    
    var options = {
		host: 'localhost',
		port: 1337,
		path: '/authenticate',
		method: 'POST',
		headers: {
		  	'Content-Type': 'application/json'
		}
    };
    
    var x = http.request(options, function(externalres){		
      	externalres.on('data', function(chunk){
            var token = JSON.parse(chunk);
            // Save data to the current local store falls falsches Login alten Token auch löschen eher für Testzwecke
            if (token.success == true){
                localStorage.setItem("token", token.token);
                localStorage.setItem("name", req.body.username);
            }
      	});			
    });
    
    x.write(JSON.stringify(req.body));
    x.end();
    
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
            var jetzt = moment();
            for(i=0; i<anVer.length; i++) {
                var start = moment(anVer[i].dateStart, "X").format('YYYY-MM-DD HH:mm');
                if(jetzt.isBefore(start)){
                    anVer[i].dateEnd = moment(anVer[i].dateEnd, "X").format('YYYY-MM-DD HH:mm');
                    anVer[i].dateStart = moment(anVer[i].dateStart, "X").format('YYYY-MM-DD HH:mm');
                }else{
                    delete anVer[i];
                }
            }
            res.render('pages/index', {
                anVer: anVer,
                name: localStorage.getItem("name")
            });
        });
    });
                         
    x.end();
})

app.get('/logout', function(req, res) {
    
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    
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
            var jetzt = moment();
            for(i=0; i<anVer.length; i++) {
                var start = moment(anVer[i].dateStart, "X").format('YYYY-MM-DD HH:mm');
                if(jetzt.isBefore(start)){
                    anVer[i].dateEnd = moment(anVer[i].dateEnd, "X").format('YYYY-MM-DD HH:mm');
                    anVer[i].dateStart = moment(anVer[i].dateStart, "X").format('YYYY-MM-DD HH:mm');
                }else{
                    delete anVer[i];
                }
            }
            res.render('pages/index', {
                anVer: anVer,                      
                name: localStorage.getItem("name")
            });
        });
    });
                         
    x.end();
})

app.get('/profil', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/user?username='+localStorage.getItem("name"),
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    
    var x = http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            var nutzer = JSON.parse(chunk);
            res.render('pages/profil', {
                nutzer: nutzer,
                name: localStorage.getItem("name")
            });
        });
    });
    x.end();
})



app.listen(1338, function(){
console.log("Server listen on Port 1338");
});