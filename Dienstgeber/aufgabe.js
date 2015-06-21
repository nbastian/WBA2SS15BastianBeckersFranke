/**
 *  PerPla Personalplanung
 *  restful-endpoints orientiert an der facebook graph api
 * 
 *  (c) 2015 by christian franke, franky.ws
 */

// include express module
var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis').createClient();
var crypto = require('crypto'), 
    shasum = crypto.createHash('sha1');
var moment = require('moment');
    
// functions
var sha1sum = function(input) {
    // function for creating sha1-hash
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex');
}

var parseJsonList = function(jsonString) {
	try {
	    jsonObj = JSON.parse(jsonString);
	} catch (e) {
	    jsonObj = [];
	}
	
	return jsonObj;
}

// init em up
var app = express();

// set bodyparser as default
app.use(bodyParser.json({ extended: true }));

// environments
app.set('port', process.env.PORT || 1337);
var userlistObj = 'userlist';
var adminlistObj = 'adminlist';
var organizerObj = 'organizerlist';
var eventObj = 'events';

// redis error handling
redis.on('error', function (err) {
    console.log(err);
    process.exit(1);  
});

// static assets (html-files)
app.use(express.static('public'));


/**
 *  ENDPOINTS
 */

// Objekte erstellen und Demodaten in DB legen
app.route('/initdemo').get(function(req, res) {
	// User
	redis.set(userlistObj, JSON.stringify([
		{
			id: 1,
			username: 'Testuser1',
			email: 'fh@franky.ws',
			password: '7288edd0fc3ffcbe93a0cf06e3568e28521687bc' // test123
		},
		{
			id: 2,
			username: 'Testuser2',
			email: 'info@franky.ws',
			password: '7288edd0fc3ffcbe93a0cf06e3568e28521687bc' // test123
		}
	]));
	
	// Adminuser
	redis.set(adminlistObj, JSON.stringify([
		{
			id: 1,
			username: 'Franky',
			email: 'franky@pollerwiesen.org',
			password: '7288edd0fc3ffcbe93a0cf06e3568e28521687bc' // test123
		}
	]));
	
	// Veranstaltungen
	redis.set(eventObj, JSON.stringify([
		{
			id: 1,
			name: 'PollerWiesen',
			dateStart: moment('2015-08-15 13:00').format('X'),
			dateEnd: moment('2015-08-15 18:00').format('X')
		}
	]));
	
	// Organisationen
	redis.set(organizerObj, JSON.stringify([
		{
			id: 1,
			name: 'PollerWiesen GmbH',
			user: [1, 2],
			events: [1],
			adminId: 1
		}
	]));
	
	res.json({
		success: true,
		msg: 'Demodata filled successful.'
	});
});

// endpoint for getting and setting user
app.route('/user')
    
    .get(function(req, res) {
        // get userlist from db
        
        redis.get(userlistObj, function (err, obj) {
	        userObj = parseJsonList(obj);
			
            res.json(userObj);
        });
    })
    
      
    .post(function(req, res) {
        // save new user in db
        
        redis.get(userlistObj, function (err, obj) { 
            // get old list
            var userList = JSON.parse(obj)
                newId = userList.length + 1;
            
            
            // todo: check for valid inputs
            
            
            // push new user
            userList.push({
                id: newId,
                username: req.body.username,
                email: req.body.email,
                password: sha1sum(req.body.password) // never save password plaintext! todo: salt!
            });
            
            // save list
            redis.set(userlistObj, JSON.stringify(userList));
            
            // output
            res.json({ 
                success: true,
                newId: newId 
            });
        });
    });


// endpoint for existing user
// only with numberic user-id!
app.route('/user/:id([0-9]+)')

    .get(function(req, res) {
        // return single user
                
        redis.get(userlistObj, function (err, obj) {
            var userList = parseJsonList(obj),
            	user = userList.filter(function(el) {
	                return el.id == req.params.id
	            });
            
            res.json(user[0] || []);
        });
    })
    
    
    .put(function(req, res) {
        // update single user
                
        redis.get(userlistObj, function (err, obj) {
            var userList = JSON.parse(obj);
            
            for (var i in userList) {
                if (userList[i].id == req.params.id) {
                    
                    // todo: check for valid inputs
                                        
                    userList[i].username = req.body.username;
                    userList[i].email = req.body.email;
                    if (req.body.password) userList[i].password = sha1sum(req.body.password);
                    
                    break;
                }
            }
                                
            // save list
            redis.set(userlistObj, JSON.stringify(userList));
            
            // output
            res.json({ 
                success: true
            });
        });
    })
    
    .delete(function(req, res) {
        // delete single user
                
        redis.get(userlistObj, function (err, obj) {
            var userList = JSON.parse(obj);
            
            // filter userlist..
            userList = userList.filter(function(el) {
                return el.id != req.params.id
            });
                                
            // save list
            redis.set(userlistObj, JSON.stringify(userList));
            
            // output
            res.json({ 
                success: true
            });
        });
    });


// endpoint for getting and setting adminuser
app.route('/adminuser')
    
    .get(function(req, res) {
        // get userlist from db
        
        redis.get(adminlistObj, function (err, obj) {
	        userObj = parseJsonList(obj);
			
            res.json(userObj);
        });
    })
    
    
    .post(function(req, res) {
        // save new user in db
        
        redis.get(adminlistObj, function (err, obj) {
            // get old list
            var userList = JSON.parse(obj)
                newId = userList.length + 1;
            
            
            // todo: check for valid inputs
            
            
            // push new user
            userList.push({
                id: newId,
                username: req.body.username,
                email: req.body.email,
                password: sha1sum(req.body.password) // never save password plaintext! todo: salt!
            });
            
            // save list
            redis.set(adminlistObj, JSON.stringify(userList));
            
            // output
            res.json({ 
                success: true,
                newId: newId 
            });
        });
    });


// endpoint for existing user
// only with numberic user-id!
app.route('/adminuser/:id([0-9]+)')

    .get(function(req, res) {
        // return single user
                
        redis.get(adminlistObj, function (err, obj) {
            var userList = parseJsonList(obj),
            	user = userList.filter(function(el) {
	                return el.id == req.params.id
	            });
            
            res.json(user[0] || []);
        });
    })
    
    
    .put(function(req, res) {
        // update single user
                
        redis.get(adminlistObj, function (err, obj) {
            var userList = JSON.parse(obj);
            
            for (var i in userList) {
                if (userList[i].id == req.params.id) {
                    
                    // todo: check for valid inputs
                                        
                    userList[i].username = req.body.username;
                    userList[i].email = req.body.email;
                    if (req.body.password) userList[i].password = sha1sum(req.body.password);
                    
                    break;
                }
            }
                                
            // save list
            redis.set(adminlistObj, JSON.stringify(userList));
            
            // output
            res.json({ 
                success: true
            });
        });
    })
    
    .delete(function(req, res) {
        // delete single user
                
        redis.get(adminlistObj, function (err, obj) {
            var userList = JSON.parse(obj);
            
            // filter userlist..
            userList = userList.filter(function(el) {
                return el.id != req.params.id
            });
                                
            // save list
            redis.set(adminlistObj, JSON.stringify(userList));
            
            // output
            res.json({ 
                success: true
            });
        });
    });






// endpoint for getting and setting organisation
app.route('/organizer')
    
    .get(function(req, res) {
        // get userlist from db
        
        redis.get(organizerObj, function (err, obj) {
	        var organizerList = parseJsonList(obj);
			
            res.json(organizerList);
        });
    })
    
    
    .post(function(req, res) {
        // save new user in db
        
        redis.get(organizerObj, function (err, obj) {
            // get old list
            var organizerList = JSON.parse(obj)
                newId = organizerList.length + 1;
            
            
            // todo: check for valid inputs
            
            
            // push new user
            organizerList.push({
                id: newId,
                name: req.body.name,
                user: req.body.userIdList,
                events: req.body.eventIdList,
                adminId: req.body.adminId
            });
            
            // save list
            redis.set(organizerObj, JSON.stringify(organizerList));
            
            // output
            res.json({ 
                success: true,
                newId: newId 
            });
        });
    });


// endpoint for existing organisations
// only with numberic organisation-id!
app.route('/organizer/:id([0-9]+)')

    .get(function(req, res) {
        // return single user
                
        redis.get(organizerObj, function (err, obj) {
            var organizerList = parseJsonList(obj),
            	organisation = organizerList.filter(function(el) {
	                return el.id == req.params.id
	            });
            
            res.json(organisation[0] || []);
        });
    })
    
    
    .put(function(req, res) {
        // update single user
                
        redis.get(organizerObj, function (err, obj) {
            var organizerList = JSON.parse(obj);
            
            for (var i in organizerList) {
                if (organizerList[i].id == req.params.id) {
                    
                    // todo: check for valid inputs
                                        
                    if (req.body.name) organizerList[i].name = req.body.name;
                    if (req.body.userIdList) organizerList[i].user = req.body.userIdList;
                    if (req.body.eventIdList) organizerList[i].events = req.body.eventIdList;
                    if (req.body.adminId) organizerList[i].adminId = req.body.adminId;
                    
                    break;
                }
            }
                                
            // save list
            redis.set(organizerObj, JSON.stringify(organizerList));
            
            // output
            res.json({ 
                success: true
            });
        });
    })
    
    .delete(function(req, res) {
        // delete single user
                
        redis.get(organizerObj, function (err, obj) {
            var organizerList = JSON.parse(obj);
            
            // filter userlist..
            organizerList = organizerList.filter(function(el) {
                return el.id != req.params.id
            });
                                
            // save list
            redis.set(organizerObj, JSON.stringify(organizerList));
            
            // output
            res.json({ 
                success: true
            });
        });
    });




/** 
 *  START IT UP..
 */

// Start server listening..
var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    
    console.log('+++++++++++++++++++++++++++++++++++++++++');
    console.log('+ PerPla Personalplanung                +');
    console.log('+++++++++++++++++++++++++++++++++++++++++');
    console.log('');
    console.log('Please point your browser to http://localhost:%s', port);
});