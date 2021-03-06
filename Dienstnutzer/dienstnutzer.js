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

make_passwd = function(n, a) {
  var index = (Math.random() * (a.length - 1)).toFixed(0);
  return n > 0 ? a[index] + make_passwd(n - 1, a) : '';
};

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
                name: req.cookies.username,
                isCompany: req.cookies.isCompany,
                error: req.query.error
            });
        });
    });
                         
    x.end();
})

app.post('/veranstaltungen', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/event?token=' + req.cookies.token,
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
    
    x.write(JSON.stringify({"id": req.cookies.id,
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
            if(req.cookies.isCompany == 'true'){
                veranstaltungen = veranstaltungen.filter(function(ver) {
	               return ver.userId == req.cookies.companyId;
                });
            } else {
                veranstaltungen = [];
            }
            res.render('pages/veranstaltungen', {
                veranstaltungen: veranstaltungen,
                name: req.cookies.username,
                isCompany: req.cookies.isCompany
            });
        });
    });                   
    x.end();
})

app.delete('/veranstaltungen/:VeranstaltungsID', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/event/'+req.params.VeranstaltungsID + '?token=' + req.cookies.token,
        method: 'DELETE',
        headers: {
            accept: 'application/json'
        }
    };
    
    var x = http.request(options, function(externalres){
        externalres.on('data', function(chunk){
            res.json({"success": true});
        });
    });                      
    x.end();
});

app.get('/mitarbeiter', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path: '/user?token='+req.cookies.token,
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    }
        
    var x = http.request(options, function(externalres) {
        externalres.on('data', function(chunk){
            var users = JSON.parse(chunk);
            if(req.cookies.isCompany == 'true'){
                users = users.filter(function(user) {
	               return user.isCompany == false && user.companyId == req.cookies.companyId;
                });
            } else {
                users = users.filter(function(user) {
                    return user.username == req.cookies.username;
                });
            }
            
            res.render('pages/mitarbeitervw', {
                users: users,
                name: req.cookies.username,
                isCompany: req.cookies.isCompany
            });
        });
    });
    
    x.end();
});

app.get('/mitarbeiter/:userID', function(req, res) {
    var x = http.request({
        host: 'localhost',
        port: 1337,
        path: '/user/' + req.params.userID + '?token=' + req.cookies.token,
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    }, function(externalres){
        externalres.on('data', function(respJsonString){
            var userRow = JSON.parse(respJsonString);
            
            res.render('pages/mitarbeiter', {
                user: userRow,
                name: req.cookies.username,
                isCompany: req.cookies.isCompany
            });
        });
    });                   
    x.end();
});

app.put('/mitarbeiter/:userID', function(req, res) {
    var x = http.request({
        host: 'localhost',
        port: 1337,
        path: '/user/' + req.params.userID + '?token=' + req.cookies.token,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    }, function(externalres){
        externalres.on('data', function(respJsonString){
            res.json({ success: true });
        });
    });

    x.write(JSON.stringify(req.body));      
               
    x.end();
});

app.delete('/mitarbeiter/:userID', function(req, res) {
    var options = {
        host: 'localhost',
        port: 1337,
        path:'/user/' + req.params.userID + '?token=' + req.cookies.token,
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
    if(req.body.password != null) {
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
    }
    else {
        var x= http.request(options, function(externalres){
            externalres.on('data', function(chunk){
                var user = JSON.parse(chunk);
                if(user != null){
                    res.json({"success": true});
                }
            });
        });
        console.log(make_passwd(13, 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'));
        x.write(JSON.stringify({"username": req.body.username,
                                "isCompany": req.body.isCompany,
                                "companyId": req.cookies.id,
                                "password": make_passwd(13, 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'),
                               "email": req.body.email}));
        x.end();
    }
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
                res.cookie('id', jsonResp.user.id, cookieOptions);
                res.cookie('username', jsonResp.user.username, cookieOptions);
                res.cookie('companyId', jsonResp.user.companyId, cookieOptions);
                res.cookie('isCompany', jsonResp.user.isCompany, cookieOptions);
				res.redirect('/');
            } else {
	            res.redirect('/?error=true');
            }
      	});			
    });
    x.write(JSON.stringify(req.body));
    x.end();
})

app.get('/logout', function(req, res) {
    res.clearCookie('token');
    res.clearCookie('username');
    
    
	res.redirect('/');
})

app.get('/profil', function(req, res) {
    res.redirect('/mitarbeiter/' + req.cookies.id + '/');
});

// demodata filler endpoint
var module_events_roster = require('./events_roster.js');
module_events_roster.init(app, http);



app.listen(1338, function(){
console.log("Server listen on Port 1338");
});