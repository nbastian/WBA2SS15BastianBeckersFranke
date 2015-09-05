var http = require('http');
var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();
var moment = require('moment');

var app = express();
var cookieParser = require('cookie-parser')

// set bodyparser as default
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

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
                var start = moment(anVer[i].dateStart, "X");
                if(jetzt.isBefore(start)){
                    anVer[i].dateEnd = moment(anVer[i].dateEnd, "X").format('DD.MM.YYYY HH:mm');
                    anVer[i].dateStart = moment(anVer[i].dateStart, "X").format('DD.MM.YYYY HH:mm');
                }else{
                    delete anVer[i];
                }
            }
            
            res.render('pages/index', {
                anVer: anVer,
                name: req.cookies.username
            });
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
                          "start": moment(veranstaltung.dateStart, "X").format('DD.MM.YYYY HH:mm'),
                          "end": moment(veranstaltung.dateEnd, "X").format('DD.MM.YYYY HH:mm'),
                          "name": veranstaltung.name,
                         "success": true});
            }
        });
    });
    
    x.write(JSON.stringify({"id": req.body.id,
                          "dateStart": req.body.dateStart + " " + req.body.timeStart,
                          "dateEnd": req.body.dateEnd + " " + req.body.timeEnd,
                          "name": req.body.name}));
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
                veranstaltungen[i].dateEnd = moment(veranstaltungen[i].dateEnd, 'X').format('DD.MM.YYYY HH:mm');
                veranstaltungen[i].dateStart = moment(veranstaltungen[i].dateStart, 'X').format('DD.MM.YYYY HH:mm');
            }
            res.render('pages/veranstaltungen', {
                veranstaltungen: veranstaltungen,
                name: 'ANME'
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
            
            veranstaltung.dateEnd = moment(veranstaltung.dateEnd, 'X').format('DD.MM.YYYY HH:mm');
            veranstaltung.dateStart = moment(veranstaltung.dateStart, 'X').format('DD.MM.YYYY HH:mm');

            res.render('pages/veranstaltung', {
                veranstaltung: veranstaltung,
                name: req.cookies.username
            });
        });
    });                     
    x.end();
})

app.delete('/veranstaltungen/:VeranstaltungsID', function(req, res) {
    /*var options = {
        host: 'localhost',
        port: 1337,
        path: '/event',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var x = http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            res.json({"success": true});
        });
    });
    x.end();*/
    
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/event/'+req.params.VeranstaltungsID,
        method: 'DELETE',
        headers: {
            accept: 'application/json'
        }
    };
    
    var x = http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            console.log(chunk);
            /*var veranstaltung = JSON.parse(chunk);
            
            veranstaltung.dateEnd = moment(veranstaltung.dateEnd, 'X').format('DD.MM.YYYY HH:mm');
            veranstaltung.dateStart = moment(veranstaltung.dateStart, 'X').format('DD.MM.YYYY HH:mm');

            res.render('pages/veranstaltung', {
                veranstaltung: veranstaltung,
                name: req.cookies.username
            });*/
            res.json({"success": true});
        });
    });                     
    x.end();
})

app.get('/mitarbeiter', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/user',
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    }
        
    var x = http.request(options, function(externalres) {
        externalres.on('data', function(chunk){
            var users = JSON.parse(chunk);
            res.render('pages/mitarbeitervw', {
                users: users,
                name: req.cookies.username
            });
        });
    });
    
    x.end();
})

app.delete('/mitarbeiter/:userID', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path:'/user/'+req.params.userID,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var x = http.request(options, function(externalres) {
        externalres.on('data', function(chunk) {
            res.json({"success": true});
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
            if(user != null){
                res.json({"success": true});
            }
        });
    });
        
    x.write(JSON.stringify(req.body));
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
            var jsonResp = JSON.parse(chunk);
            
            // Save data to the current local store falls falsches Login alten Token auch löschen eher für Testzwecke
            if (jsonResp.success == true) {
	            var cookieOptions = { 
		            maxAge: 60 * 60 * 24 * 30 * 12, // one year
		            httpOnly: true 
		        };
		        
                res.cookie('token', jsonResp.token, cookieOptions);
                res.cookie('username', jsonResp.user.username, cookieOptions);
            }
      	});			
    });
    
    x.write(JSON.stringify(req.body));
    x.end();
    
    res.redirect('/');
})

app.get('/logout', function(req, res) {
    res.clearCookie('token');
    res.clearCookie('username');
    
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
                name: req.cookies.username
            });
        });
    });
                         
    x.end();
})

app.get('/profil', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        
        // WIRD NICHT MEHR FUNKTIONIEREN!!!
        path: '/user?username=' + req.cookies.username,
        // /user?username=.. gibts nicht mehr
        
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
                name: req.cookies.username
            });
        });
    });
    x.end();
})



app.listen(1338, function(){
console.log("Server listen on Port 1338");
});